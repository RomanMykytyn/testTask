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
    newUser.save()
    return JsonResponse({'status':'good'})

@csrf_exempt
def editUser(request):
    data = json.loads(request.body)
    all_users = MyUsers.objects.all()
    for i in all_users:
        if i.name == data['oldname']:
            editUser = i
        if i.name == data['name']:
            return JsonResponse({'status':'bad'})
    groupId = MyGroups.objects.get(name=data['select'])
    editUser.name = data['name']
    editUser.group = groupId
    editUser.save()
    return JsonResponse({'status':'good'})

@csrf_exempt
def deleteUser(request):
    data = json.loads(request.body)
    all_users = MyUsers.objects.all()
    for i in all_users:
        if i.name == data['name']:
            i.delete()
            return JsonResponse({'status':'good'})
    return JsonResponse({'status':'bad'})

@csrf_exempt
def addGroup(request):
    data = json.loads(request.body)
    print(data)
    all_groups = MyGroups.objects.all()
    for i in all_groups:
        if i.name == data['name']:
            return JsonResponse({'status':'bad'})
    newGroup = MyGroups(name = data['name'], description = data['description'])
    newGroup.save()
    return JsonResponse({'status':'good'})

@csrf_exempt
def editGroup(request):
    data = json.loads(request.body)
    all_groups = MyGroups.objects.all()
    for i in all_groups:
        if i.name == data['oldname']:
            editGroup = i
        if i.name == data['name']:
            return JsonResponse({'status':'bad'})
    editGroup.name = data['name']
    editGroup.description = data['description']
    editGroup.save()
    return JsonResponse({'status':'good'})

@csrf_exempt
def deleteGroup(request):
    data = json.loads(request.body)
    all_groups = MyGroups.objects.all()
    all_users = MyUsers.objects.all()
    for j in all_users:
        if j.group == data['name']:
            return JsonResponse({'status':'bad'})
    for i in all_groups:
        if i.name == data['name']:
            i.delete()
            return JsonResponse({'status':'good'})
    return JsonResponse({'status':'bad'})
