import { CameraPreset } from "../util/types";
import { useState } from "react";
import { TextInput } from "../components/TextInput";
import { SettingsEditor } from "../components/SettingsEditor";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../components/Button";
import { Controls, ControlsEditor } from "../components/ControlsEditor";

export function PresetEditor({
  preset,
}: {
  preset: CameraPreset | null;
}): JSX.Element {
  const [presetName, setPresetName] = useState(preset?.name ?? "");
  const [order, setOrder] = useState(preset?.order ?? "");
  const [controls, setControls] = useState<Controls>({
    pan: preset?.pan ?? 0,
    tilt: preset?.tilt ?? 0,
    zoom: preset?.zoom ?? 1,
    focus: preset?.focus ?? 1,
  });
  const [settings, setSettings] = useState(preset?.settings ?? {});

  const cameraId = Number(
    (document.getElementById("camera-id") as HTMLInputElement | undefined)
      ?.value ?? 1,
  );

  async function save() {
    // TODO: Implement save
  }

  return (
    <div className="h-full flex flex-col p-4">
      <h1>{preset ? "Edit" : "Create"} Preset</h1>
      <div className="flex-grow overflow-auto">
        <TextInput
          label="Preset Name"
          value={presetName}
          onChange={setPresetName}
        />
        <TextInput label="Order" value={order.toString()} onChange={setOrder} />
        <ControlsEditor
          controls={controls}
          onChange={setControls}
          cameraId={cameraId}
        />
        <SettingsEditor settings={settings} onChange={setSettings} />

        <Button onClick={save}>
          <FontAwesomeIcon icon={faSave} /> Save
        </Button>
        <Button onClick={() => window.history.back()} secondary>
          Cancel
        </Button>
      </div>
    </div>
  );
}
