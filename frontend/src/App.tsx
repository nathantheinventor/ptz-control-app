import { CameraList } from "./pages/CameraList";

const CAMERAS = [
  {
    id: 1,
    name: "Center Camera",
    ip: "192.168.1.17",
    username: "admin",
    password: "admin",
    default_settings: {
      id: 1,
      aperture: null,
      brightness: null,
      saturation: null,
      contrast: null,
      sharpness: null,
      hue: null,
    },
    presets: [
      {
        id: 1,
        name: "Preset 1",
        order: 1,
        thumbnail: "https://via.placeholder.com/150",
        settings: {
          id: 1,
          aperture: null,
          brightness: null,
          saturation: null,
          contrast: null,
          sharpness: null,
          hue: null,
        },
        pan: 0,
        tilt: 0,
        zoom: 0,
        focus: 0,
      },
    ],
  },
];

function App() {
  return (
    <>
      <CameraList cameras={CAMERAS} />
    </>
  );
}

export default App;
