import { RangeSelector } from './RangeSelector';
import { useState } from 'react';
import { getCsrfToken } from '../util/csrf';

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

  const updateControl = (key: keyof Controls) => async (value: number | null) => {
    const updatedControls = { ...controls };
    updatedControls[key] = value ?? 0;
    onChange?.(updatedControls);

    if (displayLive) {
      await fetch(`/cameras/update-controls/${cameraId}`, {
        method: 'POST',
        body: JSON.stringify(updatedControls),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
      });
    }
  };

  return (
    <div>
      <div className='text-xl font-bold'>Camera Controls {cameraPage ? '(not saved)' : ''}</div>
      <div>
        <input type='checkbox' checked={displayLive} onChange={() => setDisplayLive(!displayLive)} />
        <span className='ml-2'>Update Live</span>
      </div>
      <RangeSelector
        label='Pan'
        value={controls.pan}
        onChange={updateControl('pan')}
        min={-170}
        max={170}
        postfix='°'
        notNull
      />
      <RangeSelector
        label='Tilt'
        value={controls.tilt}
        onChange={updateControl('tilt')}
        min={-20}
        max={90}
        postfix='°'
        notNull
      />
      <RangeSelector label='Zoom' value={controls.zoom} onChange={updateControl('zoom')} min={0} max={16384} notNull />
      <RangeSelector
        label='Focus'
        value={controls.focus}
        onChange={updateControl('focus')}
        min={0}
        max={8192}
        notNull
      />
    </div>
  );
}
