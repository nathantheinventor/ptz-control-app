import { CameraList } from "./pages/CameraList";
import { PresetEditor } from "./pages/PresetEditor";
import { CameraEditor } from "./pages/CameraEditor";

const SETTINGS = {
  id: 1,
  aperture: null,
  brightness: null,
  saturation: null,
  contrast: null,
  sharpness: null,
  hue: null,
};
const PRESET = {
  id: 1,
  name: "Preset 1 with a very very long name",
  order: 1,
  thumbnail: "https://placehold.co/256x144",
  settings: SETTINGS,
  pan: 0,
  tilt: 0,
  zoom: 0,
  focus: 0,
};
const CAMERA = {
  id: 1,
  name: "Center Camera",
  ip: "192.168.1.17",
  username: "admin",
  password: "admin",
  default_settings: SETTINGS,
  presets: [
    PRESET,
    PRESET,
    PRESET,
    PRESET,
    PRESET,
    PRESET,
    PRESET,
    PRESET,
    PRESET,
    PRESET,
    PRESET,
  ],
};

function App() {
  return (
    <>
      {/*<CameraList cameras={[CAMERA, CAMERA, CAMERA, CAMERA]}/>*/}
      <CameraEditor camera={CAMERA} />
      {/*<PresetEditor preset={PRESET} />*/}
    </>
  );
}

export default App;
