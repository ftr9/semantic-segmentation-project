from django.urls import path
from .views import LogixApiView,LogixApiViewId

urlpatterns = [
    path('api/',LogixApiView.as_view()),
    path('api/<int:logixId>',LogixApiViewId.as_view())
]