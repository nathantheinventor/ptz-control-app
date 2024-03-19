from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def index(request: HttpRequest) -> HttpResponse:
    """Render the index page"""
    return render(request, "ptz_app/index.html")


def recall_preset(request: HttpRequest):
    """Recall a given preset"""
    ...  # TODO: implement
