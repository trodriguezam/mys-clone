from rest_framework import serializers
from .models import User, Shop, Product, MatchUserProduct

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class MatchUserProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchUserProduct
        fields = '__all__'
    