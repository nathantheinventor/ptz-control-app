from django.apps import AppConfig


class PtzAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"  # pyright: ignore[reportAssignmentType]
    name = "ptz_app"
