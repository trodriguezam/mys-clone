from rest_framework import serializers
from .models import User, Shop, Product, MatchUserProduct
from django.contrib.auth.models import User, Group, Permission
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    preferred_colores = serializers.JSONField(required=False)
    preferred_tipos = serializers.JSONField(required=False)
    preferred_marcas = serializers.JSONField(required=False)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, required=False)
    user_permissions = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), many=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 'preferred_colores',
            'preferred_tipos', 'preferred_marcas', 'groups', 'user_permissions'
        ]

    def create(self, validated_data):
        # Remove and hash the password
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        
        if password:
            user.set_password(password)
        
        # Set any custom fields, like preferences
        if 'preferred_colores' in validated_data:
            user.preferred_colores = validated_data['preferred_colores']
        if 'preferred_tipos' in validated_data:
            user.preferred_tipos = validated_data['preferred_tipos']
        if 'preferred_marcas' in validated_data:
            user.preferred_marcas = validated_data['preferred_marcas']
        
        user.save()
        return user


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
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        # Hash the password before saving the user
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)