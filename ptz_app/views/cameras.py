import json
from dataclasses import asdict

import dacite
from django.http import Http404, HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from ptz_app.functions.camera import (
    CameraSpec,
    Controls,
    apply_controls,
    read_controls,
    apply_settings,
    Settings,
)

CAMERA_TEMPLATE = "ptz_app/camera.html"


def new_camera(request: HttpRequest) -> HttpResponse:
    """Create a new camera"""
    return render(request, CAMERA_TEMPLATE, {"camera": "null"})


def edit_camera(request: HttpRequest, camera_id: int) -> HttpResponse:
    """Edit a camera"""
    from ptz_app.models import Camera

    camera = Camera.objects.get(id=camera_id)
    if camera is None:
        raise Http404("Camera not found")
    return render(request, CAMERA_TEMPLATE, {"camera": json.dumps(camera.json())})


def upsert_camera(request: HttpRequest) -> JsonResponse:
    """Create or update a camera"""
    from ptz_app.models import Camera, CameraSettings

    assert request.method == "POST"
    body = json.loads(request.body)

    settings = body["default_settings"]
    default_settings = CameraSettings(
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
        default_settings.id = settings["id"]
    default_settings.save()

    camera = Camera(
        name=body["name"],
        ip=body["ip"],
        username=body["username"],
        password=body["password"],
        default_settings=default_settings,
    )
    if body.get("id") is not None:
        camera.id = body["id"]
    camera.save()

    return JsonResponse({"status": "ok"})


def delete_camera(request: HttpRequest, camera_id: int) -> JsonResponse:
    """Delete a camera"""
    from ptz_app.models import Camera

    assert request.method == "DELETE"

    camera = Camera.objects.get(id=camera_id)
    if camera is not None:
        camera.delete()
    return JsonResponse({"status": "ok"})


def get_camera_controls(request: HttpRequest, camera_id: int) -> JsonResponse:
    """Get the camera controls."""
    from ptz_app.models import Camera

    camera = Camera.objects.get(id=camera_id)
    if camera is None:
        return JsonResponse({"status": "error", "message": "Camera not found"})

    camera_spec = CameraSpec(ip=camera.ip, username=camera.username, password=camera.password)
    controls = read_controls(camera_spec)

    return JsonResponse(asdict(controls))


def update_camera_controls(request: HttpRequest, camera_id: int) -> JsonResponse:
    """Update the camera controls."""
    from ptz_app.models import Camera

    assert request.method == "POST"
    body = json.loads(request.body)

    camera = Camera.objects.get(id=camera_id)
    if camera is None:
        return JsonResponse({"status": "error", "message": "Camera not found"})

    camera_spec = CameraSpec(ip=camera.ip, username=camera.username, password=camera.password)
    controls = Controls(
        pan=body["pan"],
        tilt=body["tilt"],
        zoom=body["zoom"],
        focus=body["focus"],
    )
    apply_controls(camera_spec, controls)

    return JsonResponse({"status": "ok"})


def preview_settings(request: HttpRequest, settings_id: int) -> JsonResponse:
    """Apply the settings to the camera."""
    from ptz_app.models import Camera, CameraSettings, Preset

    assert request.method == "POST"

    settings = CameraSettings.objects.get(id=settings_id)
    if settings is None:
        return JsonResponse({"status": "error", "message": "Settings not found"})

    preset: Preset | None = settings.preset_set.first()
    camera: Camera | None = settings.camera_set.first()
    if camera is None:
        assert preset is not None
        camera = preset.camera
    assert camera is not None
    camera_spec = CameraSpec(ip=camera.ip, username=camera.username, password=camera.password)

    json_settings = json.loads(request.body)
    if preset is not None:
        for key, value in preset.json().items():
            if json_settings.get(key) is None:
                json_settings[key] = value
    settings_preview = dacite.from_dict(Settings, json_settings)

    apply_settings(camera_spec, settings_preview)

    return JsonResponse({"status": "ok"})
