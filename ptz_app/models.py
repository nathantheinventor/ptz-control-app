from django.db import models


class CameraSettings(models.Model):
    """Default camera settings."""

    aperture = models.FloatField(null=True)
    brightness = models.IntegerField(null=True)
    saturation = models.IntegerField(null=True)
    contrast = models.IntegerField(null=True)
    sharpness = models.IntegerField(null=True)
    hue = models.IntegerField(null=True)

    # TODO: Find all camera settings


class Camera(models.Model):
    """Camera model."""

    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField()
    username = models.CharField(max_length=100, null=True)
    password = models.CharField(max_length=100, null=True)
    default_settings = models.ForeignKey(CameraSettings, on_delete=models.CASCADE)


class Preset(models.Model):
    """Camera preset model."""

    name = models.CharField(max_length=100)
    order = models.IntegerField()
    thumbnail = models.ImageField()
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE)
    settings = models.ForeignKey(CameraSettings, on_delete=models.CASCADE)
    pan = models.FloatField()
    tilt = models.FloatField()
    zoom = models.FloatField()
    focus = models.FloatField()
