"""Django views for the PTZ app."""

from ptz_app.views.index import index
from ptz_app.views.cameras import (
    new_camera,
    edit_camera,
    upsert_camera,
    delete_camera,
    get_camera_controls,
    update_camera_controls,
    preview_settings,
)
from ptz_app.views.presets import (
    new_preset,
    edit_preset,
    upsert_preset,
    delete_preset,
    recall_preset,
    update_thumbnail,
)

__all__ = [
    "index",
    "new_camera",
    "edit_camera",
    "upsert_camera",
    "delete_camera",
    "get_camera_controls",
    "update_camera_controls",
    "preview_settings",
    "new_preset",
    "edit_preset",
    "upsert_preset",
    "delete_preset",
    "recall_preset",
    "update_thumbnail",
]
