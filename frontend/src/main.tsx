import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CameraList } from "./pages/CameraList";

const root = document.getElementById("root");
const cameraList = document.getElementById("camera-list");
// const cameraEditor = document.getElementById("camera-editor")
// const presetEditor = document.getElementById("preset-editor")

const data = document.getElementById("data") as HTMLInputElement;

const pages: [HTMLElement | null, () => JSX.Element][] = [
  [root, () => <App />],
  [cameraList, () => <CameraList cameras={JSON.parse(data.value)} />],
  // [cameraEditor, () => <CameraEditor camera={JSON.parse(data.value)} />],
  // [presetEditor, () => <PresetEditor preset={JSON.parse(data.value)} />]
];

for (const [element, component] of pages) {
  if (element) {
    ReactDOM.createRoot(element).render(
      <React.StrictMode>{component()}</React.StrictMode>,
    );
    break;
  }
}
