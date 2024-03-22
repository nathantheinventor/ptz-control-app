from django.urls import path

from ptz_app import views

urlpatterns = [
    path("", views.index, name="index"),
    path("cameras/new", views.new_camera, name="new_camera"),
    path("cameras/<int:camera_id>", views.edit_camera, name="edit_camera"),
    path("cameras/upsert", views.upsert_camera, name="upsert_camera"),
    path("cameras/delete/<int:camera_id>", views.delete_camera, name="delete_camera"),
    path("presets/new/<int:camera_id>", views.new_preset, name="new_preset"),
    path("presets/<int:preset_id>", views.edit_preset, name="edit_preset"),
    path("presets/upsert", views.upsert_preset, name="upsert_preset"),
    path("presets/delete/<int:preset_id>", views.delete_preset, name="delete_preset"),
    path("presets/recall/<int:preset_id>", views.recall_preset, name="recall_preset"),
]
