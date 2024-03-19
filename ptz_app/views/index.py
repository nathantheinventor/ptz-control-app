import json

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render


def index(request: HttpRequest) -> HttpResponse:
    """Render the index page"""
    from ptz_app.models import Camera

    context = {
        "cameras": json.dumps([camera.json() for camera in Camera.objects.all()])
    }
    return render(request, "ptz_app/index.html", context)


def recall_preset(request: HttpRequest, preset_id: int) -> JsonResponse:
    """Recall a given preset"""
    ...  # TODO: implement
    return JsonResponse({"status": "ok"})
