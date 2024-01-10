from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .serializer import LogixSerializers,FileSerializer
from rest_framework.parsers import FileUploadParser
import cv2
import numpy as np
from keras.models import load_model

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

    model = load_model('models/model.h5')

    def put(self, request, *args, **kwargs):

        image_file = request.FILES['file']
        image_data = image_file.read()


        # Read the image from in-memory bytes using OpenCV
        image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
        h, w, _ = image.shape

        x = cv2.resize(image, (512, 512))
        x = x.astype(np.float32) / 255.0  ## (h, w, 3)
        x = np.expand_dims(x, axis=0)  ## (1, h, w, 3)

        """ Prediction """
        y = self.model.predict(x, verbose=0)[0][:, :, 2]
        y = cv2.resize(y, (w, h))  # Resize mask to original image size

        # Create a transparency mask (0s for background, 255s for foreground)
        transparency_mask = np.uint8((y > 0.5) * 255)

        # Create a blank image with a transparent background
        transparent_image = np.zeros((h, w, 4), dtype=np.uint8)
        # Copy the object onto the transparent background
        transparent_image[:, :, :3] = image
        transparent_image[:, :, 3] = transparency_mask

        # Save the image with a transparent background as PNG
        image_name = f"{uuid.uuid4()}-bgremoved.png"
        output_path = f"uploads/{image_name}"
        cv2.imwrite(output_path, transparent_image)

        return Response({'message': 'File uploaded successfully', 'filename': image_name},
                        status=status.HTTP_201_CREATED)


