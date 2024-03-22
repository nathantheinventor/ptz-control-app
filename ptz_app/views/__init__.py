"""Django views for the PTZ app."""

from ptz_app.views.index import index, recall_preset
from ptz_app.views.cameras import new_camera, edit_camera, upsert_camera

__all__ = ["index", "recall_preset", "new_camera", "edit_camera", "upsert_camera"]
