from django.shortcuts import render
from django.core import serializers
from .models import MyUsers, MyGroups
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.

def index(request):
    return render(request, 'index.html')


def getUsers(request):
    data = serializers.serialize("json", MyUsers.objects.all(), indent=1, use_natural_foreign_keys=True)
    return HttpResponse(data, content_type='json')

def getGroups(request):
    data = serializers.serialize("json", MyGroups.objects.all(), indent=1)
    return HttpResponse(data, content_type='json')

@csrf_exempt
def addUser(request):
    data = json.loads(request.body)
    print(data)
    all_users = MyUsers.objects.all()
    for i in all_users:
        if i.name == data['name']:
            return JsonResponse({'status':'bad'})
    
    groupId = MyGroups.objects.get(name=data['select'])
    newUser = MyUsers(name = data['name'], group = groupId)
    '''weGotId = PlaceType.objects.get(id=id)
    info_to_db = Place(place_name = cinema, place_type = weGotId)'''
    newUser.save()
    return JsonResponse({'status':'good'})
