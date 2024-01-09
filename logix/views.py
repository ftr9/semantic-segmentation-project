from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializer import LogixSerializers,FileSerializer
import os
import uuid

from .models import Logix
# Create your views here.
class LogixApiView(APIView):
    
    #permission_classes = [permissions.IsAuthenticated]
    
    def get(self,req,*args,**kwargs):
        
        logix_instance = Logix.objects.all()
        logixSerializer = LogixSerializers(logix_instance,many=True);
       
        return Response(logixSerializer.data,status=status.HTTP_200_OK)
    
    def post(self,req,*args,**kwargs):
        
        data = {
            "logixName":req.data.get('logixName'),
            "source":req.data.get('source'), 
            "destination":req.data.get('destination')
        }
        
        logix_serializer = LogixSerializers(data=data)
        if(logix_serializer.is_valid()):
            logix_serializer.save()
            return Response(logix_serializer.data,status=status.HTTP_201_CREATED)
            
        return Response(logix_serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LogixApiViewId(APIView):
    def get(self,req,logixId,*args,**kwargs):
        logix_instace = Logix.objects.get(id=logixId)
        logix_serializer = LogixSerializers(logix_instace)
        return Response(logix_serializer.data,status=status.HTTP_200_OK)
    
    def delete(self,req,logixId,*args,**kwargs):
        activeLogixObj =  Logix.objects.get(id=logixId)
        activeLogixObj.delete()
        return Response({'status':'deleted successfully'},status=status.HTTP_200_OK)
    
    def put(self,req,logixId,*args,**kwargs):
       
   
        activeLogixObj =  Logix.objects.get(id=logixId)
        
        logix_serializer = LogixSerializers(instance = activeLogixObj, data=req.data, partial = True)
        if logix_serializer.is_valid():
            logix_serializer.save()
            return Response(logix_serializer.data, status=status.HTTP_200_OK)
        return Response(logix_serializer.errors,status=status.HTTP_200_OK)
   
   

class FileUploadView(APIView):
    
    def saveFileToDestination(self,uploaded_file):
        save_path = 'uploads'  # Replace this with your desired directory
        file_name_tobe_saved = f"{uuid.uuid4()}-{uploaded_file.name}"
            # Check if the directory exists, if not, create it
        if not os.path.exists(save_path):    
            os.makedirs(save_path)

            
        # Save the file to the specified directory
        file_path = os.path.join(save_path, file_name_tobe_saved)
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        #return the file name after successful upload.
        return file_name_tobe_saved
    
    def post(self, request, *args, **kwargs):
        serializer = FileSerializer(data=request.data)
        
        if serializer.is_valid():
            uploaded_file = serializer.validated_data['file']
            saved_file_name = self.saveFileToDestination(uploaded_file)
           
            # Return a success response
            return Response({'message': 'File uploaded successfully','filename':saved_file_name}, status=status.HTTP_201_CREATED)
        
        # If serializer is not valid, return error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)