import json
from django.http import Http404

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

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

    camera = Camera.objects.get(id=body["camera_id"])
    if camera is None:
        return JsonResponse({"status": "error", "message": "Camera not found"})

    settings = body["settings"]
    preset_settings = CameraSettings(
        aperture=settings.get("aperture"),
        brightness=settings.get("brightness"),
        saturation=settings.get("saturation"),
        contrast=settings.get("contrast"),
        sharpness=settings.get("sharpness"),
        hue=settings.get("hue"),
    )
    if settings.get("id") is not None:
        preset_settings.id = settings["id"]
    preset_settings.save()

    preset = Preset(
        name=body["name"],
        order=body["order"],
        thumbnail=body["thumbnail"],
        camera=camera,
        settings=preset_settings,
        pan=body["pan"],
    )
    if body.get("id") is not None:
        preset.id = body["id"]
    preset.save()

    return JsonResponse({"status": "ok"})


def delete_preset(request: HttpRequest, preset_id: int) -> JsonResponse:
    """Delete a camera preset."""
    from ptz_app.models import Preset

    preset = Preset.objects.get(id=preset_id)
    if preset is None:
        return JsonResponse({"status": "error", "message": "Preset not found"})
    preset.delete()

    return JsonResponse({"status": "ok"})


def recall_preset(request: HttpRequest, preset_id: int) -> JsonResponse:
    """Recall a camera preset."""
    from ptz_app.models import Preset

    preset = Preset.objects.get(id=preset_id)
    if preset is None:
        return JsonResponse({"status": "error", "message": "Preset not found"})
    # TODO: recall a preset
    return JsonResponse({"status": "ok"})
