from django.db import models

# Create your models here.

class MyUsers(models.Model):
    name = models.CharField(max_length=20,)
    created = models.DateField(auto_now=False, auto_now_add=True,)
    group = models.ForeignKey('MyGroups', on_delete=models.CASCADE,)

    def __str__(self):
        return self.name

class MyGroupsManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)

class MyGroups(models.Model):
    name = models.CharField(max_length=20,)
    description = models.CharField(max_length=200,)

    def __str__(self):
        return self.name

    objects = MyGroupsManager()

    class Meta:
        unique_together = [['name']]

    def natural_key(self):
        return (self.name)
