import { RangeSelector } from './RangeSelector';
import { useState } from 'react';
import { getCsrfToken } from '../util/csrf';
import { PanTiltSelector } from './PanTiltSelector';

export type Controls = {
  pan: number;
  tilt: number;
  zoom: number;
  focus: number;
};

type ControlsEditorProps = {
  controls: Controls;
  onChange?: (controls: Controls) => void;
  cameraId: number;
  cameraPage?: boolean;
};

export function ControlsEditor({ controls, onChange, cameraId, cameraPage = false }: ControlsEditorProps): JSX.Element {
  const [displayLive, setDisplayLive] = useState(true);

  const displayControls = async (controls: Controls) => {
    if (displayLive) {
      await fetch(`/cameras/update-controls/${cameraId}`, {
        method: 'POST',
        body: JSON.stringify(controls),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
      });
    }
  };

  const updateControl = (key: keyof Controls) => async (value: number | null) => {
    const updatedControls = { ...controls };
    updatedControls[key] = value ?? 0;
    onChange?.(updatedControls);

    await displayControls(updatedControls);
  };

  const updatePanTilt = async (pan: number, tilt: number) => {
    const updatedControls = { ...controls, pan, tilt };
    onChange?.(updatedControls);
    await displayControls(updatedControls);
  };

  return (
    <div>
      <div className='text-xl font-bold'>Camera Controls {cameraPage ? '(not saved)' : ''}</div>
      <div>
        <input type='checkbox' checked={displayLive} onChange={() => setDisplayLive(!displayLive)} />
        <span className='ml-2'>Update Live</span>
      </div>
      <PanTiltSelector pan={controls.pan} tilt={controls.tilt} onChange={updatePanTilt} />
      <RangeSelector label='Zoom' value={controls.zoom} onChange={updateControl('zoom')} min={0} max={16384} notNull />
      <RangeSelector
        label='Focus'
        value={controls.focus}
        onChange={updateControl('focus')}
        min={0}
        max={4096}
        notNull
      />
    </div>
  );
}
