from django.contrib import admin
from .models import MyUsers, MyGroups
# Register your models here.

admin.site.register(MyUsers)
admin.site.register(MyGroups)
