from django.shortcuts import render
from .models import User, Shop, Product, MatchUserProduct
from .serializers import UserSerializer, ShopSerializer, ProductSerializer, MatchUserProductSerializer, UserSignupSerializer
from rest_framework import generics, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class UserSignup(generics.CreateAPIView):
    serializer_class = UserSignupSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email
        })

class CurrentUser(generics.RetrieveAPIView):
    def get_object(self):
        return self.request.user
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class ShopListCreate(generics.ListCreateAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class ShopRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [IsAuthenticated]

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class ProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class MatchUserProductListCreate(generics.ListCreateAPIView):
    queryset = MatchUserProduct.objects.all()
    serializer_class = MatchUserProductSerializer
    permission_classes = [IsAuthenticated]

class MatchUserProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = MatchUserProduct.objects.all()
    serializer_class = MatchUserProductSerializer
    permission_classes = [IsAuthenticated]

class MatchUser(generics.ListCreateAPIView):
    queryset = MatchUserProduct.objects.all()
    serializer_class = MatchUserProductSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return MatchUserProduct.objects.filter(user=self.request.user)

