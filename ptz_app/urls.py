from django.urls import path

from ptz_app import views

urlpatterns = [
    path("", views.index, name="index"),
    path("recall-preset/<preset-id:int>", views.recall_preset, name="index"),
]
