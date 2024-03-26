export type CameraSettings = {
  id?: number;
  iris?: number | null;
  shutter?: number | null;
  gain?: number | null;
  drc?: number | null;
  red_gain?: number | null;
  blue_gain?: number | null;
  saturation?: number | null;
  hue?: number | null;
  brightness?: number | null;
  contrast?: number | null;
  sharpness?: number | null;
  gamma?: number | null;
  color_temperature?: number | null;
  noise2d?: number | null;
  noise3d?: number | null;
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
