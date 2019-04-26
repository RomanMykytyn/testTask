from django.shortcuts import render
from django.core import serializers
from .models import MyUsers, MyGroups
from django.http import HttpResponse
# Create your views here.

def index(request):
    return render(request, 'index.html')


def getUsers(request):
    data = serializers.serialize("json", MyUsers.objects.all())
    return HttpResponse(data, content_type='json')
