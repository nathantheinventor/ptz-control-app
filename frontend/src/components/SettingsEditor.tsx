import { CameraSettings } from '../util/types';
import { useEffect, useState } from 'react';
import { RangeSelector } from './RangeSelector';
import { DropdownSelector } from './DropdownSelector';
import { getCsrfToken } from '../util/csrf';

const IRIS_OPTIONS = ['Closed', '11.0', '9.6', '8.0', '6.8', '5.6', '4.8', '4.0', '3.4', '2.8', '2.4', '2.0', '1.8'];
const SHUTTER_OPTIONS = [
  '1 / 30',
  '1 / 60',
  '1 / 90',
  '1 / 100',
  '1 / 125',
  '1 / 180',
  '1 / 250',
  '1 / 350',
  '1 / 500',
  '1 / 725',
  '1 / 1000',
  '1 / 1500',
  '1 / 2000',
  '1 / 3000',
  '1 / 4000',
  '1 / 6000',
  '1 / 10000',
];
const SATURATION_OPTIONS = Array.from({ length: 15 }, (_, i) => `${60 + i * 10}%`);
const COLOR_TEMP_OPTIONS = Array.from({ length: 56 }, (_, i) => `${2500 + i * 100}K`);
const GAMMA_OPTIONS = ['Default', '0.45', '0.5', '0.56', '0.63'];

type SettingsEditorProps = {
  settings: CameraSettings;
  onChange: (settings: CameraSettings) => void;
};

export function SettingsEditor({ settings, onChange }: SettingsEditorProps): JSX.Element {
  const [displayLive, setDisplayLive] = useState(true);

  const [iris, setIris] = useState(settings.iris);
  const [shutter, setShutter] = useState(settings.shutter);
  const [gain, setGain] = useState(settings.gain);
  const [drc, setDRC] = useState(settings.drc);
  const [redGain, setRedGain] = useState(settings.red_gain);
  const [blueGain, setBlueGain] = useState(settings.blue_gain);
  const [saturation, setSaturation] = useState(settings.saturation);
  const [hue, setHue] = useState(settings.hue);
  const [brightness, setBrightness] = useState(settings.brightness);
  const [contrast, setContrast] = useState(settings.contrast);
  const [sharpness, setSharpness] = useState(settings.sharpness);
  const [gamma, setGamma] = useState(settings.gamma);
  const [colorTemperature, setColorTemperature] = useState(settings.color_temperature);
  const [noise2d, setNoise2d] = useState(settings.noise2d);
  const [noise3d, setNoise3d] = useState(settings.noise3d);

  useEffect(() => {
    const settingsItems = {
      iris,
      shutter,
      gain,
      drc,
      red_gain: redGain,
      blue_gain: blueGain,
      saturation,
      hue,
      brightness,
      contrast,
      sharpness,
      gamma,
      color_temperature: colorTemperature,
      noise2d,
      noise3d,
    };
    onChange({ id: settings.id, ...settingsItems });
    if (displayLive && settings.id) {
      fetch(`/settings/display/${settings.id}`, {
        method: 'POST',
        body: JSON.stringify(settingsItems),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
      });
    }
  }, [
    settings.id,
    onChange,
    displayLive,
    iris,
    shutter,
    gain,
    drc,
    redGain,
    blueGain,
    saturation,
    hue,
    brightness,
    contrast,
    sharpness,
    gamma,
    colorTemperature,
    noise2d,
    noise3d,
  ]);

  return (
    <div className='mt-4'>
      <div className='text-xl font-bold'>Camera Settings</div>
      <div>
        <input
          type='checkbox'
          checked={displayLive && settings.id != null}
          disabled={settings.id == null}
          onChange={() => setDisplayLive(!displayLive)}
        />
        <span className={`ml-2 ${settings.id == null ? 'text-gray-500' : ''}`}>
          Update Live {settings.id == null ? '(you must save first)' : ''}
        </span>
      </div>

      <div className='text-lg font-bold'>Exposure</div>
      <DropdownSelector label='Iris' value={iris} onChange={setIris} options={IRIS_OPTIONS} />
      <DropdownSelector
        label='Shutter'
        value={shutter}
        onChange={setShutter}
        options={SHUTTER_OPTIONS}
        startIndex={1}
      />
      <RangeSelector label='Gain' value={gain} onChange={setGain} min={0} max={7} />
      <RangeSelector label='DRC' value={drc} onChange={setDRC} min={0} max={8} />

      <div className='text-lg font-bold'>Color</div>
      <RangeSelector label='Red Gain' value={redGain} onChange={setRedGain} min={0} max={255} />
      <RangeSelector label='Blue Gain' value={blueGain} onChange={setBlueGain} min={0} max={255} />
      <DropdownSelector label='Saturation' value={saturation} onChange={setSaturation} options={SATURATION_OPTIONS} />
      <RangeSelector label='Hue' value={hue} onChange={setHue} min={0} max={14} />
      <DropdownSelector
        label='Color Temperature'
        value={colorTemperature}
        onChange={setColorTemperature}
        options={COLOR_TEMP_OPTIONS}
      />

      <div className='text-lg font-bold'>Image</div>
      <RangeSelector label='Brightness' value={brightness} onChange={setBrightness} min={0} max={14} />
      <RangeSelector label='Contrast' value={contrast} onChange={setContrast} min={0} max={14} />
      <RangeSelector label='Sharpness' value={sharpness} onChange={setSharpness} min={0} max={15} />
      <DropdownSelector label='Gamma' value={gamma} onChange={setGamma} options={GAMMA_OPTIONS} />
      <RangeSelector label='Noise 2D' value={noise2d} onChange={setNoise2d} min={0} max={5} />
      <RangeSelector label='Noise 3D' value={noise3d} onChange={setNoise3d} min={0} max={8} />
    </div>
  );
}
