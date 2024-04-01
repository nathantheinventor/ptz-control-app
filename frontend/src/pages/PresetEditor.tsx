import { CameraPreset, CameraSettings } from '../util/types';
import { useEffect, useState } from 'react';
import { TextInput } from '../components/TextInput';
import { SettingsEditor } from '../components/SettingsEditor';
import { faChevronLeft, faRefresh, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../components/Button';
import { Controls, ControlsEditor } from '../components/ControlsEditor';
import { getCsrfToken } from '../util/csrf';
import { NumberInput } from '../components/NumberInput';
import { Expandable } from '../components/Expandable';

function isNonEmpty(settings: CameraSettings | undefined): boolean {
  if (!settings) return false;
  for (const [key, value] of Object.entries(settings)) {
    if (key === 'id') continue;
    if (value != null) return true;
  }
  return false;
}

export function PresetEditor({ preset }: { preset: CameraPreset | null }): JSX.Element {
  const [thumbnail, setThumbnail] = useState(preset?.thumbnail ?? '');
  const [presetName, setPresetName] = useState(preset?.name ?? '');
  const [order, setOrder] = useState(preset?.order ?? 0);
  const [controls, setControls] = useState<Controls | undefined>(
    preset
      ? {
          pan: preset.pan,
          tilt: preset.tilt,
          zoom: preset.zoom,
          focus: preset.focus,
        }
      : undefined,
  );
  const [settings, setSettings] = useState(preset?.settings ?? {});

  const cameraId = Number((document.getElementById('camera-id') as HTMLInputElement | undefined)?.value ?? 1);

  useEffect(() => {
    if (controls) return;
    fetch(`/cameras/controls/${cameraId}`, {
      method: 'GET',
      headers: { 'X-CSRFToken': getCsrfToken() },
    })
      .then((res) => res.json())
      .then((data) => setControls(data))
      .catch(() => setControls({ pan: 0, tilt: 0, zoom: 0, focus: 0 })); // TODO: delete line
  }, [cameraId, controls]);

  async function save() {
    if (!presetName) {
      alert('Preset Name is required');
      return;
    }

    await fetch('/presets/upsert', {
      method: 'POST',
      body: JSON.stringify({
        id: preset?.id,
        name: presetName,
        order,
        thumbnail,
        camera_id: cameraId,
        ...controls,
        settings,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
    });

    window.location.href = '/';
  }

  async function updateThumbnail() {
    const resp = await fetch(`/presets/update-thumbnail/${preset?.id}`, {
      method: 'POST',
      body: JSON.stringify({ controls, settings }),
      headers: { 'X-CSRFToken': getCsrfToken() },
    });
    const data = await resp.json();
    setThumbnail(data.thumbnail);
  }

  return (
    <div className='h-full flex flex-col p-4'>
      <h1>
        {preset ? 'Edit' : 'Create'} Preset{' '}
        <FontAwesomeIcon
          icon={faSave}
          onClick={save}
          className='text-blue-500 cursor-pointer text-2xl ml-4'
          title='Save'
        />
      </h1>
      <a href='/' className='pb-4'>
        <FontAwesomeIcon icon={faChevronLeft} /> Back
      </a>
      <div className='flex-grow overflow-auto'>
        <TextInput label='Preset Name' value={presetName} onChange={setPresetName} />
        <NumberInput label='Order' value={order} onChange={setOrder} />

        {preset && (
          <>
            <div className='text-xl font-bold'>Thumbnail</div>
            <div className='w-[512px] h-72 relative mb-2'>
              <img src={thumbnail} alt={preset.name} className='absolute h-full w-full' />
              <div
                className='cursor-pointer p-2 absolute top-0 right-0 bg-gray-500/40'
                title='Update Thumbnail'
                onClick={updateThumbnail}
              >
                <FontAwesomeIcon icon={faRefresh} />
              </div>
            </div>
          </>
        )}

        {controls && <ControlsEditor controls={controls} onChange={setControls} cameraId={cameraId} />}
        <div className='my-2' />
        <Expandable title='Camera Settings' defaultOpen={isNonEmpty(preset?.settings)}>
          <SettingsEditor settings={settings} onChange={setSettings} />
        </Expandable>
        <div className='my-4' />

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
