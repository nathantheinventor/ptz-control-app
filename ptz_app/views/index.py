from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render


def index(request: HttpRequest) -> HttpResponse:
    """Render the index page"""
    return render(request, "ptz_app/index.html")


def recall_preset(request: HttpRequest, preset_id: int) -> JsonResponse:
    """Recall a given preset"""
    ...  # TODO: implement
    return JsonResponse({"status": "ok"})
