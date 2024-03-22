from django.urls import path

from ptz_app import views

urlpatterns = [
    path("", views.index, name="index"),
    path("recall-preset/<int:preset_id>", views.recall_preset, name="index"),
    path("cameras/new", views.new_camera, name="new_camera"),
    path("cameras/<int:camera_id>", views.edit_camera, name="edit_camera"),
    path("cameras/upsert", views.upsert_camera, name="upsert_camera"),
    path("cameras/delete/<int:camera_id>", views.delete_camera, name="delete_camera"),
]
