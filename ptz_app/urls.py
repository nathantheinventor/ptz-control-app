from django.urls import path

from ptz_app import views

urlpatterns = [
    path("", views.index, name="index"),
    path("recall-preset/<int:preset_id>", views.recall_preset, name="index"),
]
