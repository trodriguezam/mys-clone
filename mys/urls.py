from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('current-user/', views.CurrentUser.as_view(), name='current-user'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('signup/', views.UserSignup.as_view(), name='signup'),
    path('users/', views.UserListCreate.as_view(), name='user-list-create'),
    path('users/<int:pk>/', views.UserRetrieveUpdateDestroy.as_view(), name='user-retrieve-update-destroy'),
    path('shops/', views.ShopListCreate.as_view(), name='shop-list-create'),
    path('shops/<int:pk>/', views.ShopRetrieveUpdateDestroy.as_view(), name='shop-retrieve-update-destroy'),
    path('products/', views.ProductListCreate.as_view(), name='product-list-create'),
    path('products/<int:pk>/', views.ProductRetrieveUpdateDestroy.as_view(), name='product-retrieve-update-destroy'),
    path('match-user-products/', views.MatchUserProductListCreate.as_view(), name='match-user-product-list-create'),
    path('match-user-products/<int:pk>/', views.MatchUserProductRetrieveUpdateDestroy.as_view(), name='match-user-product-retrieve-update-destroy'),
]