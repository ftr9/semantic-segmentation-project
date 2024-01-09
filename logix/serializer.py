from rest_framework import serializers
from .models import Logix

class LogixSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Logix
        fields = ["logixName", "source", "destination"]
        
class FileSerializer(serializers.Serializer):
    file = serializers.FileField()