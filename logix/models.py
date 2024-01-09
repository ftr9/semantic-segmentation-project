from django.db import models

# Create your models here.

class Logix(models.Model):
    logixName = models.CharField(max_length=50)
    source = models.CharField(max_length=30) 
    destination = models.CharField(max_length = 30)
    
    def __str__(self):
        return self.task
