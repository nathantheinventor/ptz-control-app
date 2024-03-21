import { CameraSettings } from "../util/types";

type SettingsEditorProps = {
  settings: CameraSettings;
  onChange: (settings: CameraSettings) => void;
};

export function SettingsEditor({
  settings,
  onChange,
}: SettingsEditorProps): JSX.Element {
  return <div></div>;
}
