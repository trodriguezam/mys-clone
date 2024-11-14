import random
from django.shortcuts import render
from .models import User, Shop, Product, MatchUserProduct
from .serializers import UserSerializer, ShopSerializer, ProductSerializer, MatchUserProductSerializer, UserSignupSerializer, UserLoginSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
import json
from django.http import JsonResponse


class UserLogin(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        if user is not None:
            return Response({
                'user_id': user.pk,
                'email': user.email,
                'username': user.username,
                'preferred_colores': user.preferred_colores,
                'preferred_tipos': user.preferred_tipos,
                'preferred_marcas': user.preferred_marcas,
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserSignup(generics.CreateAPIView):
    serializer_class = UserSignupSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user_id': user.pk,
            'email': user.email
        })


class CurrentUser(generics.RetrieveAPIView):
    def get_object(self):
        return self.request.user
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        # Enable partial update by setting partial=True
        partial = kwargs.pop('partial', True)
        return super().update(request, *args, partial=partial, **kwargs)

class ShopListCreate(generics.ListCreateAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class ShopRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [AllowAny]

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class ProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class MatchUserProductListCreate(generics.ListCreateAPIView):
    queryset = MatchUserProduct.objects.all()
    serializer_class = MatchUserProductSerializer
    permission_classes = [AllowAny]

class MatchUserProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = MatchUserProduct.objects.all()
    serializer_class = MatchUserProductSerializer
    permission_classes = [AllowAny]

class MatchUser(generics.ListCreateAPIView):
    queryset = MatchUserProduct.objects.all()
    serializer_class = MatchUserProductSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return MatchUserProduct.objects.filter(user=self.request.user)

class RecommendProducts(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Parse the JSON body manually for GET request
            data = json.loads(request.body)
            print(data)
            user_id = data.get('user_id')
            preferred_colors = json.loads(data.get('preferred_colores', '[]'))
            preferred_types = json.loads(data.get('preferred_tipos', '[]'))
            preferred_brands = json.loads(data.get('preferred_marcas', '[]'))

            # Check if user exists
            user = get_object_or_404(User, id=user_id)

            # Fetch user's preferences as sets for easy matching
            preferred_colors_set = set(preferred_colors)
            preferred_types_set = set(preferred_types)
            preferred_brands_set = set(preferred_brands)

            # Get IDs of products the user has already liked
            liked_products_ids = MatchUserProduct.objects.filter(user=user).values_list('product_id', flat=True)

            # Content-based filtering for products matching preferences
            content_based_qs = Product.objects.exclude(id__in=liked_products_ids).filter(
                Q(color__overlap=list(preferred_colors_set)) |
                Q(tipo__overlap=list(preferred_types_set)) |
                Q(marca__overlap=list(preferred_brands_set))
            )

            # Collaborative filtering by finding products liked by users with similar preferences
            similar_users = User.objects.filter(
                Q(preferred_colores__in=[json.dumps(list(preferred_colors_set))]) |
                Q(preferred_tipos__in=[json.dumps(list(preferred_types_set))]) |
                Q(preferred_marcas__in=[json.dumps(list(preferred_brands_set))])
            ).exclude(id=user.id)
            
            collaborative_qs = Product.objects.filter(
                matchuserproduct__user__in=similar_users
            ).exclude(id__in=liked_products_ids).annotate(like_count=Count('matchuserproduct')).order_by('-like_count')

            # Combine results and prioritize recommendations
            recommendations = list(content_based_qs) + list(collaborative_qs)

            # Sort recommendations based on how well they match user's preferences and like count
            recommendations = sorted(
                recommendations,
                key=lambda product: (
                    (1 if set(product.color).intersection(preferred_colors_set) else 0) +
                    (1 if set(product.tipo).intersection(preferred_types_set) else 0) +
                    (1 if set(product.marca).intersection(preferred_brands_set) else 0),
                    -product.matchuserproduct_set.count()
                ),
                reverse=True
            )

             # If no recommendations, return random products from the database
            if not recommendations:
                recommendations = random.sample(list(Product.objects.all()), 5)  # Get 10 random products
                print("No recommendations found, returning random products:", recommendations)

            # Serialize and return the recommendations
            serialized_recommendations = [
                {
                    'id': product.id,
                    'color': product.color,
                    'tipo': product.tipo,
                    'marca': product.marca,
                    'descripcion': product.descripcion,
                    'precio_actual': product.precio_actual,
                    'precio_anterior': product.precio_anterior,
                    'imagen_url': product.imagen_url,
                    'product_url': product.product_url,
                    'size': product.size,
                    'category': product.category
                }
                for product in recommendations
            ]

            return JsonResponse(serialized_recommendations, safe=False, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format in request body"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return JsonResponse({"error": f"Missing field in request body: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
