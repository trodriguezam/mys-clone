from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=254, unique=True)
    username = models.CharField(max_length=50, unique=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=50, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(Group, related_name='custom_user_set')
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_set')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class Shop(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
    phone = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)

    def __str__(self):
        return self.name

class Product(models.Model):
    descripcion = models.TextField(verbose_name="Descripción", null=True, blank=True)
    precio_actual = models.FloatField(verbose_name="Precio Actual", null=True, blank=True)
    precio_anterior = models.FloatField(verbose_name="Precio Anterior", null=True, blank=True)
    imagen_url = models.URLField(verbose_name="Imagen URL", null=True, blank=True)
    marca = models.CharField(max_length=100, verbose_name="Marca", null=True, blank=True)
    vendedor = models.ForeignKey(Shop, on_delete=models.CASCADE, verbose_name="Vendedor", null=True, blank=True)
    SIZES = ['XS', 'S', 'M', 'L', 'XL']
    size = models.CharField(
        max_length=3,
        choices=[(size, size) for size in SIZES],
        null=True,
        blank=True,
        verbose_name="Tamaño"
    )
    category = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name="Categoría"
    )

    def __str__(self):
        return f"{self.marca} - {self.descripcion}"

class MatchUserProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

