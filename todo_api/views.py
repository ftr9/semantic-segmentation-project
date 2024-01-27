from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from . import models
from . import serializers

# Create your views here.
class TodoListApiView(APIView):

    permission_classes = [permissions.IsAuthenticated]
        
    def get(self,request,*args,**kwargs):
        todos = models.Todo.objects.all()
        todoSerializers = serializers.TodoSerializer(todos,many=True)
        return Response(todoSerializers.data,status=status.HTTP_200_OK)

    def getSingleTodo(self,request,todoId,*args,**kwargs):
        print(todoId)
        return Response({'status':"success"},status=status.HTTP_200_OK)
    
    def delete(self,request,*args,**kwargs):

    
        return Response({"status":"failed"},status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
    def put(self,request,*args,**kwargs):
        return Response({"status":"faied"},status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def post(self,request,*args,**kwargs):
        data = {
            'task':request.data.get('task'),
            'completed':request.data.get('completed'),
            'user':request.user.id
        }
        postTodoSerializer = serializers.TodoSerializer(data=data)
        if(postTodoSerializer.is_valid()):
            postTodoSerializer.save()
            return Response(postTodoSerializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializers.TodoSerializer.errors,status=status.HTTP_400_BAD_REQUEST)