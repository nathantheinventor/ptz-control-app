import io
from dataclasses import dataclass
from PIL import Image


@dataclass
class CameraSpec:
    """Info to connect to camera."""

    ip: str
    username: str | None
    password: str | None


@dataclass
class Controls:
    """Camera controls."""

    pan: float
    tilt: float
    zoom: float
    focus: float


@dataclass
class Settings:
    """Camera settings."""

    aperture: float | None
    brightness: int | None
    saturation: int | None
    contrast: int | None
    sharpness: int | None
    hue: int | None


def apply_controls(camera: CameraSpec, controls: Controls) -> None:
    """Apply the controls to the camera."""
    pass  # TODO: implement this function


def read_controls(camera: CameraSpec) -> Controls:
    """Read the current state of controls from the camera."""
    # TODO: implement this function
    return Controls(pan=0.0, tilt=0.0, zoom=0.0, focus=0.0)


def apply_settings(camera: CameraSpec, settings: Settings) -> None:
    """Apply the settings to the camera."""
    pass  # TODO: implement this function


def fetch_thumbnail(camera: CameraSpec) -> bytes:
    """Fetch the camera thumbnail."""
    # TODO: implement this function
    f = io.BytesIO()
    Image.new("RGB", (512, 288)).save(f, format="JPEG")
    return f.getvalue()
