from django.urls import path
from .views import LogixApiView,LogixApiViewId,FileUploadView

urlpatterns = [
    path('api/',LogixApiView.as_view()),
    path('api/<int:logixId>',LogixApiViewId.as_view()),
    path('api/upload/',FileUploadView.as_view())
]