import { RangeSelector } from './RangeSelector';
import { useState } from 'react';
import { getCsrfToken } from '../util/csrf';
import { PanTiltSelector } from './PanTiltSelector';
import { Button } from './Button';

const AUTOFOCUS_DESCRIPTION =
  'This command temporarily turns on autofocus to let the camera adjust to the optimal focus point. Then it saves the focus value for exact recall in the future.';

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

/**
 * Queue to limit control updates to one at a time but make sure the last request gets through.
 */
class ControlRequestQueue {
  private nextValue: Controls | null = null;
  private pending = false;
  constructor(private cameraId: number) {}

  async updateControls(controls: Controls) {
    this.nextValue = controls;
    if (!this.pending) {
      this.pending = true;
      await this.sendNext();
    }
  }

  private async sendNext() {
    if (!this.nextValue) return;
    if (this.pending) return;

    this.pending = true;
    const controls = this.nextValue;
    this.nextValue = null;
    try {
      await fetch(`/cameras/update-controls/${this.cameraId}`, {
        method: 'POST',
        body: JSON.stringify(controls),
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
      });
    } finally {
      this.pending = false;
      if (this.nextValue) await this.sendNext();
    }
  }
}

export function ControlsEditor({ controls, onChange, cameraId, cameraPage = false }: ControlsEditorProps): JSX.Element {
  const [displayLive, setDisplayLive] = useState(true);
  const queue = useState(new ControlRequestQueue(cameraId))[0];

  const displayControls = async (controls: Controls) => {
    if (displayLive) {
      await queue.updateControls(controls);
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

  async function autofocus() {
    const resp = await fetch(`/cameras/autofocus/${cameraId}`, {
      method: 'POST',
      headers: { 'X-CSRFToken': getCsrfToken() },
    });
    const focus = await resp.json();
    onChange?.({ ...controls, focus });
  }

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
      <Button title={AUTOFOCUS_DESCRIPTION} onClick={autofocus}>
        Get Autofocus Value
      </Button>
    </div>
  );
}
