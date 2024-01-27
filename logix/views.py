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
        x = cv2.resize(image, (512, 512))
        x = x/255.0
        x = np.expand_dims(x, axis=0)

        """ Prediction """
        pred = self.model.predict(x, verbose=0)

        """ Save final prediction with removed background as PNG """
        image_h, image_w, _ = image.shape

        mask = pred[0][0]
        mask = cv2.resize(mask, (image_w, image_h))
        mask = np.expand_dims(mask, axis=-1)

        # Create RGBA image with transparency
        result_image = np.concatenate([image, mask * 255], axis=-1).astype(np.uint8)


        # Save the image with a transparent background as PNG
        image_name = f"{uuid.uuid4()}-bgremoved.png"
        output_path = f"uploads/{image_name}"
        cv2.imwrite(output_path,result_image, [cv2.IMWRITE_PNG_COMPRESSION, 0])

        return Response({'message': 'File uploaded successfully', 'filename': image_name},
                        status=status.HTTP_201_CREATED)


