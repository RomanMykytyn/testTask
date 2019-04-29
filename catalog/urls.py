from django.urls import path
from . import views


urlpatterns = [
    path('', views.index),
    path('api/getUsers', views.getUsers),
    path('api/getGroups', views.getGroups),
    path('api/addUser', views.addUser),
]
