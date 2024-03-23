import base64
from typing import Any

from django.db import models
import dacite
from ptz_app.functions.camera import Settings


class CameraSettings(models.Model):
    """Default camera settings."""

    aperture = models.FloatField(null=True)
    brightness = models.IntegerField(null=True)
    saturation = models.IntegerField(null=True)
    contrast = models.IntegerField(null=True)
    sharpness = models.IntegerField(null=True)
    hue = models.IntegerField(null=True)

    # TODO: Find all camera settings

    def json(self) -> dict[str, Any]:
        """Return a JSON representation of the camera settings."""
        return {
            "aperture": self.aperture,
            "brightness": self.brightness,
            "saturation": self.saturation,
            "contrast": self.contrast,
            "sharpness": self.sharpness,
            "hue": self.hue,
        }

    def to_dataclass(self) -> Settings:
        """Return a dataclass representation of the camera settings."""
        return dacite.from_dict(Settings, self.json())


class Camera(models.Model):
    """Camera model."""

    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField()
    username = models.CharField(max_length=100, null=True)
    password = models.CharField(max_length=100, null=True)
    default_settings = models.ForeignKey(CameraSettings, on_delete=models.CASCADE)

    def json(self) -> dict[str, Any]:
        """Return a JSON representation of the camera."""
        return {
            "id": self.id,
            "name": self.name,
            "ip": self.ip,
            "username": self.username,
            "password": self.password,
            "default_settings": self.default_settings.json(),
            "presets": [preset.json() for preset in self.preset_set.all().order_by("order")],
        }


class Preset(models.Model):
    """Camera preset model."""

    name = models.CharField(max_length=100)
    order = models.IntegerField()
    thumbnail = models.BinaryField()
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE)
    settings = models.ForeignKey(CameraSettings, on_delete=models.CASCADE)
    pan = models.FloatField()
    tilt = models.FloatField()
    zoom = models.FloatField()
    focus = models.FloatField()

    def json(self) -> dict[str, Any]:
        """Return a JSON representation of the camera preset."""
        return {
            "id": self.id,
            "name": self.name,
            "order": self.order,
            "thumbnail": "data:image/jpeg;base64," + base64.b64encode(self.thumbnail).decode(),
            "settings": self.settings.json(),
            "pan": self.pan,
            "tilt": self.tilt,
            "zoom": self.zoom,
            "focus": self.focus,
        }
