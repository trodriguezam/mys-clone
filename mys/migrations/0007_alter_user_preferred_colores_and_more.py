# Generated by Django 5.1.1 on 2024-11-06 00:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mys', '0006_alter_user_preferred_colores_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='preferred_colores',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='preferred_marcas',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='preferred_tipos',
            field=models.TextField(blank=True, null=True),
        ),
    ]