from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=50)
    address = models.CharField(max_length=50)

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

