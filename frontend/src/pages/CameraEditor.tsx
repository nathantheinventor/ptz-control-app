import { Camera } from "../util/types";

export function CameraEditor({
  camera,
}: {
  camera: Camera | null;
}): JSX.Element {
  return (
    <div className="h-full flex flex-col p-4">
      <h1>{camera ? "Edit" : "Create"} Camera</h1>
      <div className="flex-grow overflow-auto"></div>
    </div>
  );
}
