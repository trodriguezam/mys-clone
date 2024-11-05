from rest_framework import serializers
from .models import User, Shop, Product, MatchUserProduct

class UserSerializer(serializers.ModelSerializer):
    preferred_colores = serializers.JSONField()
    preferred_tipos = serializers.JSONField()
    preferred_marcas = serializers.JSONField()

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

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    preferred_colores = serializers.JSONField(required=False)
    preferred_tipos = serializers.JSONField(required=False)
    preferred_marcas = serializers.JSONField(required=False)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'phone', 'preferred_colores', 'preferred_tipos', 'preferred_marcas']

    def create(self, validated_data):
        preferred_colores = validated_data.pop('preferred_colores', [])
        preferred_tipos = validated_data.pop('preferred_tipos', [])
        preferred_marcas = validated_data.pop('preferred_marcas', [])
        
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            phone=validated_data['phone'],
        )
        
        user.set_preferred_colores(preferred_colores)
        user.set_preferred_tipos(preferred_tipos)
        user.set_preferred_marcas(preferred_marcas)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)