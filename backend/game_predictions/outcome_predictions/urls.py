from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='home'),
    path('prediction/', views.create_game, name='prediction'),
]