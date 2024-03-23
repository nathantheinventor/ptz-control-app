from django.urls import path

from ptz_app import views

urlpatterns = [
    path("", views.index, name="index"),
    path("cameras/new", views.new_camera, name="new_camera"),
    path("cameras/<int:camera_id>", views.edit_camera, name="edit_camera"),
    path("cameras/upsert", views.upsert_camera, name="upsert_camera"),
    path("cameras/delete/<int:camera_id>", views.delete_camera, name="delete_camera"),
    path("cameras/controls/<int:camera_id>", views.get_camera_controls, name="get_camera_controls"),
    path("cameras/update-controls/<int:camera_id>", views.update_camera_controls, name="update_camera_controls"),
    path("settings/display/<int:settings_id>", views.preview_settings, name="apply_settings"),
    path("presets/new/<int:camera_id>", views.new_preset, name="new_preset"),
    path("presets/<int:preset_id>", views.edit_preset, name="edit_preset"),
    path("presets/upsert", views.upsert_preset, name="upsert_preset"),
    path("presets/delete/<int:preset_id>", views.delete_preset, name="delete_preset"),
    path("presets/recall/<int:preset_id>", views.recall_preset, name="recall_preset"),
    path("presets/update-thumbnail/<int:preset_id>", views.update_thumbnail, name="update_thumbnail"),
]
