from django.urls import path
from . import views


urlpatterns = [
    path('', views.index),
    path('api/getUsers', views.getUsers),
    path('api/getGroups', views.getGroups),
    path('api/addUser', views.addUser),
    path('api/editUser', views.editUser),
    path('api/deleteUser', views.deleteUser),
    path('api/addGroup', views.addGroup),
    path('api/editGroup', views.editGroup),
    path('api/deleteGroup', views.deleteGroup),
]
