import json

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

CAMERA_TEMPLATE = "ptz_app/camera.html"


def new_camera(request: HttpRequest) -> HttpResponse:
    """Create a new camera"""
    return render(request, CAMERA_TEMPLATE, {"camera": "null"})


def edit_camera(request: HttpRequest, camera_id: int) -> HttpResponse:
    """Edit a camera"""
    from ptz_app.models import Camera

    camera = Camera.objects.get(id=camera_id)
    if camera is None:
        return render(request, CAMERA_TEMPLATE, {"camera": "null"})
    return render(request, CAMERA_TEMPLATE, {"camera": json.dumps(camera.json())})


def upsert_camera(request: HttpRequest) -> JsonResponse:
    """Create or update a camera"""
    from ptz_app.models import Camera, CameraSettings

    assert request.method == "POST"
    body = json.loads(request.body)

    settings = body["default_settings"]
    default_settings = CameraSettings(
        aperture=settings.get("aperture"),
        brightness=settings.get("brightness"),
        saturation=settings.get("saturation"),
        contrast=settings.get("contrast"),
        sharpness=settings.get("sharpness"),
        hue=settings.get("hue"),
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
