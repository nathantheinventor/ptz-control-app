export type CameraSettings = {
  id: number;
  aperture: number | null;
  brightness: number | null;
  saturation: number | null;
  contrast: number | null;
  sharpness: number | null;
  hue: number | null;
  // TODO: Add more settings
};

export type CameraPreset = {
  id: number;
  name: string;
  order: number;
  thumbnail: string;
  settings: CameraSettings;
  pan: number;
  tilt: number;
  zoom: number;
  focus: number;
};

export type Camera = {
  id: number;
  name: string;
  ip: string;
  username: string | null;
  password: string | null;
  default_settings: CameraSettings;
  presets: CameraPreset[];
};
