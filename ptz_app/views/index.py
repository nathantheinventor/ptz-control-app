from django.shortcuts import render


def index(request):
    """Render the index page"""
    return render(request, "ptz_app/index.html")


def recall_preset(request):
    """Recall a given preset"""
    ...  # TODO: implement
