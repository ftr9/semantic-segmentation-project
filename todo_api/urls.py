from django.urls import path,include
from . import views



urlpatterns = [
    path('api',views.TodoListApiView.as_view()),
]