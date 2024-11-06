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
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound


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
                'username': user.username
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
        partial = kwargs.pop('partial', False)
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

    def get(self, request):

        user_id = request.query_params.get('user[user_id]')
        
        if user_id:
            try:
                user = get_object_or_404(User, id=user_id)
            except NotFound:
                return Response({"error": "User not found"}, status=404)
        else:
            return Response({"error": "User information is missing"}, status=400)
        
        # Retrieve user preferences
        preferred_colores = user.get_preferred_colores() 
        preferred_tipos = user.get_preferred_tipos() 
        preferred_marcas = user.get_preferred_marcas() 

        # Set up filters for recommendations based on user preferences
        recommendation_filters = Q()
        
        if preferred_colores:
            recommendation_filters |= Q(color__in=preferred_colores)
        
        if preferred_tipos:
            recommendation_filters |= Q(tipo__in=preferred_tipos)
        
        if preferred_marcas:
            recommendation_filters |= Q(marca__in=preferred_marcas)

        exclude_ids = MatchUserProduct.objects.filter(user=user).values_list('product_id', flat=True)
        recommendations = Product.objects.filter(
            recommendation_filters
        ).exclude(id__in=exclude_ids)[:10]  # Limit recommendations to 10 products

        # If no recommendations match preferences, show random products
        if not recommendations.exists():
            recommendations = Product.objects.exclude(id__in=exclude_ids)[:10]

        # Serialize and return the recommended products
        serializer = ProductSerializer(recommendations, many=True)
        return Response(serializer.data)