from django.urls import path

from ptz_app import views

urlpatterns = [
    path("", views.index, name="index"),
]
