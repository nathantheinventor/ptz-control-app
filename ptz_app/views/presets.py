import json
from django.http import Http404
import dacite
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

from ptz_app.functions.camera import (
    CameraSpec,
    Controls,
    Settings,
    apply_settings,
    apply_controls,
    fetch_thumbnail,
)

PRESET_TEMPLATE = "ptz_app/preset.html"


def new_preset(request: HttpRequest, camera_id: int) -> HttpResponse:
    """Create a new camera preset."""
    return render(request, PRESET_TEMPLATE, {"preset": "null", "camera_id": camera_id})


def edit_preset(request: HttpRequest, preset_id: int) -> HttpResponse:
    """Edit a camera preset."""
    from ptz_app.models import Preset

    preset = Preset.objects.get(id=preset_id)
    if preset is None:
        raise Http404("Preset not found")
    return render(
        request,
        PRESET_TEMPLATE,
        {"preset": json.dumps(preset.json()), "camera_id": preset.camera.id},
    )


def upsert_preset(request: HttpRequest) -> JsonResponse:
    """Create or update a camera preset."""
    from ptz_app.models import Camera, CameraSettings, Preset

    assert request.method == "POST"
    body = json.loads(request.body)

    camera: Camera = Camera.objects.get(id=body["camera_id"])
    if camera is None:
        return JsonResponse({"status": "error", "message": "Camera not found"})

    settings = body["settings"]
    preset_settings = CameraSettings(
        iris=settings.get("iris"),
        shutter=settings.get("shutter"),
        gain=settings.get("gain"),
        drc=settings.get("drc"),
        red_gain=settings.get("red_gain"),
        blue_gain=settings.get("blue_gain"),
        saturation=settings.get("saturation"),
        hue=settings.get("hue"),
        brightness=settings.get("brightness"),
        contrast=settings.get("contrast"),
        sharpness=settings.get("sharpness"),
        gamma=settings.get("gamma"),
        color_temperature=settings.get("color_temperature"),
        noise2d=settings.get("noise2d"),
        noise3d=settings.get("noise3d"),
    )
    if settings.get("id") is not None:
        preset_settings.id = settings["id"]
    preset_settings.save()

    camera_spec = CameraSpec(ip=camera.ip, username=camera.username, password=camera.password)
    controls = Controls(pan=body["pan"], tilt=body["tilt"], zoom=body["zoom"], focus=body["focus"])
    apply_controls(camera_spec, controls)
    apply_settings(camera_spec, preset_settings.to_dataclass())
    thumbnail = fetch_thumbnail(camera_spec)

    preset = Preset(
        name=body["name"],
        order=body["order"],
        thumbnail=thumbnail,
        camera=camera,
        settings=preset_settings,
        pan=body["pan"],
        tilt=body["tilt"],
        zoom=body["zoom"],
        focus=body["focus"],
    )
    if body.get("id") is not None:
        preset.id = body["id"]
    preset.save()

    return JsonResponse({"status": "ok"})


def delete_preset(request: HttpRequest, preset_id: int) -> JsonResponse:
    """Delete a camera preset."""
    from ptz_app.models import Preset

    assert request.method == "DELETE"

    preset = Preset.objects.get(id=preset_id)
    if preset is None:
        return JsonResponse({"status": "error", "message": "Preset not found"})
    preset.delete()

    return JsonResponse({"status": "ok"})


def recall_preset(request: HttpRequest, preset_id: int) -> JsonResponse:
    """Recall a camera preset."""
    from ptz_app.models import Preset

    preset: Preset = Preset.objects.get(id=preset_id)
    if preset is None:
        return JsonResponse({"status": "error", "message": "Preset not found"})

    camera_spec = CameraSpec(
        ip=preset.camera.ip,
        username=preset.camera.username,
        password=preset.camera.password,
    )
    controls = Controls(pan=preset.pan, tilt=preset.tilt, zoom=preset.zoom, focus=preset.focus)
    apply_controls(camera_spec, controls)

    apply_settings(camera_spec, preset.settings.to_dataclass(preset.camera.default_settings))

    return JsonResponse({"status": "ok"})


def update_thumbnail(request: HttpRequest, preset_id: int) -> JsonResponse:
    """Update the thumbnail for a camera preset."""
    from ptz_app.models import Preset

    assert request.method == "POST"

    preset: Preset = Preset.objects.get(id=preset_id)
    if preset is None:
        return JsonResponse({"status": "error", "message": "Preset not found"})

    body = json.loads(request.body)

    camera_spec = CameraSpec(
        ip=preset.camera.ip,
        username=preset.camera.username,
        password=preset.camera.password,
    )
    if "controls" in body:
        controls = dacite.from_dict(Controls, body["controls"])
    else:
        controls = Controls(pan=preset.pan, tilt=preset.tilt, zoom=preset.zoom, focus=preset.focus)
    apply_controls(camera_spec, controls)

    if "settings" in body:
        settings = dacite.from_dict(Settings, body["settings"])
    else:
        settings = preset.settings.to_dataclass()
    apply_settings(camera_spec, settings)

    preset.thumbnail = fetch_thumbnail(camera_spec)
    preset.save()

    return JsonResponse(preset.json())
