import base64
from typing import Any

from django.db import models
import dacite
from ptz_app.functions.camera import Settings


class CameraSettings(models.Model):
    """Default camera settings."""

    iris = models.IntegerField(null=True)
    shutter = models.IntegerField(null=True)
    gain = models.IntegerField(null=True)
    drc = models.IntegerField(null=True)
    red_gain = models.IntegerField(null=True)
    blue_gain = models.IntegerField(null=True)
    saturation = models.IntegerField(null=True)
    hue = models.IntegerField(null=True)
    brightness = models.IntegerField(null=True)
    contrast = models.IntegerField(null=True)
    sharpness = models.IntegerField(null=True)
    gamma = models.IntegerField(null=True)
    color_temperature = models.IntegerField(null=True)
    noise2d = models.IntegerField(null=True)
    noise3d = models.IntegerField(null=True)

    def json(self) -> dict[str, Any]:
        """Return a JSON representation of the camera settings."""
        return {
            "id": self.id,
            "iris": self.iris,
            "shutter": self.shutter,
            "gain": self.gain,
            "drc": self.drc,
            "red_gain": self.red_gain,
            "blue_gain": self.blue_gain,
            "saturation": self.saturation,
            "hue": self.hue,
            "brightness": self.brightness,
            "contrast": self.contrast,
            "sharpness": self.sharpness,
            "gamma": self.gamma,
            "color_temperature": self.color_temperature,
            "noise2d": self.noise2d,
            "noise3d": self.noise3d,
        }

    def to_dataclass(self, default_settings: "CameraSettings | None" = None) -> Settings:
        """Return a dataclass representation of the camera settings."""
        json_settings = self.json()
        del json_settings["id"]
        if default_settings is not None:
            default_json = default_settings.json()
            del default_json["id"]
            for key in default_json:
                if json_settings[key] is None:
                    json_settings[key] = default_json[key]
        return dacite.from_dict(Settings, json_settings)


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
    pan = models.IntegerField()
    tilt = models.IntegerField()
    zoom = models.IntegerField()
    focus = models.IntegerField()

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
