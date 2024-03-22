import { CameraPreset } from "../util/types";

export function PresetEditor({
  preset,
}: {
  preset: CameraPreset | null;
}): JSX.Element {
  return (
    <div className="h-full flex flex-col p-4">
      <h1>{preset ? "Edit" : "Create"} Preset</h1>
      <div className="flex-grow overflow-auto"></div>
    </div>
  );
}
