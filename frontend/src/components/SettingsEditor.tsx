import { CameraSettings } from "../util/types";
import { useEffect, useState } from "react";
import { RangeSelector } from "./RangeSelector";
import { OptionSelector } from "./OptionSelector";

type SettingsEditorProps = {
  settings: CameraSettings;
  onChange: (settings: CameraSettings) => void;
};

export function SettingsEditor({
  settings,
  onChange,
}: SettingsEditorProps): JSX.Element {
  const [displayLive, setDisplayLive] = useState(true);
  const [aperture, setAperture] = useState(settings.aperture);
  const [brightness, setBrightness] = useState(settings.brightness);
  const [saturation, setSaturation] = useState(settings.saturation);
  const [contrast, setContrast] = useState(settings.contrast);
  const [sharpness, setSharpness] = useState(settings.sharpness);
  const [hue, setHue] = useState(settings.hue);

  useEffect(() => {
    const settingsItems = {
      aperture,
      brightness,
      saturation,
      contrast,
      sharpness,
      hue,
    };
    onChange({ id: settings.id, ...settingsItems });
    if (displayLive && settings.id) {
      fetch(`/settings/display/${settings.id}`, {
        method: "POST",
        body: JSON.stringify(settingsItems),
      });
    }
  }, [
    settings.id,
    onChange,
    displayLive,
    aperture,
    brightness,
    saturation,
    contrast,
    sharpness,
    hue,
  ]);

  return (
    <div className="mt-4">
      <div className="text-xl font-bold">Camera Settings</div>
      <div>
        <input
          type="checkbox"
          checked={displayLive && settings.id != null}
          disabled={settings.id == null}
          onChange={() => setDisplayLive(!displayLive)}
        />
        <span className={`ml-2 ${settings.id == null ? "text-gray-500" : ""}`}>
          Display Live {settings.id == null ? "(you must save first)" : ""}
        </span>
      </div>

      <OptionSelector
        label="Aperture"
        value={aperture}
        onChange={setAperture}
        options={[1.8, 2.5, 5, 10, 30]}
      />
      <RangeSelector
        label="Brightness"
        value={brightness}
        onChange={setBrightness}
        min={0}
        max={100}
      />
      <RangeSelector
        label="Saturation"
        value={saturation}
        onChange={setSaturation}
        min={0}
        max={100}
      />
      <RangeSelector
        label="Contrast"
        value={contrast}
        onChange={setContrast}
        min={0}
        max={100}
      />
      <RangeSelector
        label="Sharpness"
        value={sharpness}
        onChange={setSharpness}
        min={0}
        max={100}
      />
      <RangeSelector
        label="Hue"
        value={hue}
        onChange={setHue}
        min={0}
        max={100}
      />
    </div>
  );
}
