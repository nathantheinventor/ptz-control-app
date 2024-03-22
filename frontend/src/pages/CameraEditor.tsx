import { Camera, CameraSettings } from "../util/types";
import { TextInput } from "../components/TextInput";
import { useState } from "react";
import { Button } from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { SettingsEditor } from "../components/SettingsEditor";
import { getCsrfToken } from "../util/csrf";

export function CameraEditor({
  camera,
}: {
  camera: Camera | null;
}): JSX.Element {
  const [cameraName, setCameraName] = useState(camera?.name ?? "");
  const [ip, setIp] = useState(camera?.ip ?? "");
  const [username, setUsername] = useState(camera?.username ?? "");
  const [password, setPassword] = useState(camera?.password ?? "");
  const [settings, setSettings] = useState<CameraSettings>(
    camera?.default_settings ?? {},
  );

  async function save() {
    if (!cameraName || !ip) {
      alert("All fields are required");
      return;
    }

    await fetch("/cameras/upsert", {
      method: "POST",
      body: JSON.stringify({
        id: camera?.id,
        name: cameraName,
        ip,
        username,
        password,
        default_settings: settings,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    window.location.href = "/";
  }

  return (
    <div className="h-full flex flex-col p-4">
      <h1>{camera ? "Edit" : "Create"} Camera</h1>
      <div className="flex-grow overflow-auto">
        <TextInput
          label="Camera Name"
          value={cameraName}
          onChange={setCameraName}
        />
        <TextInput label="IP Address" value={ip} onChange={setIp} />
        <TextInput label="Username" value={username} onChange={setUsername} />
        <TextInput label="Password" value={password} onChange={setPassword} />

        <SettingsEditor settings={settings} onChange={setSettings} />

        <Button onClick={save}>
          <FontAwesomeIcon icon={faSave} /> Save
        </Button>
        <Button onClick={() => (window.location.href = "/")} secondary>
          Cancel
        </Button>
      </div>
    </div>
  );
}
