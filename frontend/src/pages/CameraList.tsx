type CameraSettings = {
  id: number;
  aperture: number | null;
  brightness: number | null;
  saturation: number | null;
  contrast: number | null;
  sharpness: number | null;
  hue: number | null;
  // TODO: Add more settings
};

type CameraPreset = {
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

type Camera = {
  id: number;
  name: string;
  ip: string;
  username: string | null;
  password: string | null;
  default_settings: CameraSettings;
  presets: CameraPreset[];
};

export function CameraList({ cameras }: { cameras: Camera[] }): JSX.Element {
  return (
    <div className="bg-green font-bold underline">
      <h1>Cameras</h1>
      <ul>
        {cameras.map((camera) => (
          <li key={camera.id}>{camera.name}</li>
        ))}
      </ul>
    </div>
  );
}
