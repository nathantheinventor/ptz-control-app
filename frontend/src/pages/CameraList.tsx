import { Camera, CameraPreset } from '../util/types';
import { Expandable } from '../components/Expandable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPencil, faPlus, faPlusCircle, faSync, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Button } from '../components/Button';
import { getCsrfToken } from '../util/csrf';

function AddPreset({ cameraId }: { cameraId: number }): JSX.Element {
  return (
    <a href={`/presets/new/${cameraId}`}>
      <div className='w-64 h-36 rounded-lg m-2 relative cursor-pointer bg-blue-700/40 text-white flex flex-col text-center justify-center'>
        <FontAwesomeIcon icon={faPlusCircle} className='text-6xl' />
        <span className='h-4 pt-2'>Create New Preset</span>
      </div>
    </a>
  );
}

function PresetDisplay({ preset }: { preset: CameraPreset }): JSX.Element {
  const [popover, setPopover] = useState(false);
  const [thumbnail, setThumbnail] = useState(preset.thumbnail);
  const togglePopover = () => setPopover(!popover);

  const recallPreset = () =>
    fetch(`/presets/recall/${preset.id}`, {
      method: 'POST',
      headers: { 'X-CSRFToken': getCsrfToken() },
    });
  async function updateThumbnail() {
    const resp = await fetch(`/presets/update-thumbnail/${preset.id}`, {
      method: 'POST',
      body: '{}',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
    });
    const data = await resp.json();
    setThumbnail(data.thumbnail);
    setPopover(false);
  }
  async function deleteThumbnail() {
    if (confirm('Are you sure you want to delete this thumbnail?')) {
      await fetch(`/presets/delete/${preset.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': getCsrfToken() },
      });
    }
    window.location.reload();
  }

  return (
    <div className='w-64 h-36 m-2 relative'>
      <img src={thumbnail} alt={preset.name} className='h-full w-full absolute cursor-pointer' onClick={recallPreset} />
      <span className='absolute bottom-0 px-2 py-1 w-full bg-gray-700/50 text-white text-nowrap text-ellipsis overflow-hidden'>
        {preset.name}
      </span>
      <div
        className='absolute top-0 right-0 px-2 py-1 bg-gray-700/50 text-white cursor-pointer'
        onClick={togglePopover}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>
      {popover && (
        <div className='absolute top-0 right-5 bg-white text-black cursor-pointer font-bold'>
          <a href={`/presets/${preset.id}`}>
            <div className='px-2 py-1 hover:bg-gray-100 text-black font-bold'>
              <FontAwesomeIcon icon={faPencil} /> Edit Preset
            </div>
          </a>
          <div className='px-2 py-1 hover:bg-gray-100' onClick={updateThumbnail}>
            <FontAwesomeIcon icon={faSync} /> Update Thumbnail
          </div>
          <div className='px-2 py-1 hover:bg-gray-100 text-red-500' onClick={deleteThumbnail}>
            <FontAwesomeIcon icon={faTrash} /> Delete Preset
          </div>
        </div>
      )}
    </div>
  );
}

function CameraDisplay({ camera }: { camera: Camera }): JSX.Element {
  const editCamera = () => (window.location.href = `/cameras/${camera.id}`);

  async function deleteCamera() {
    if (confirm('Are you sure you want to delete this camera?')) {
      await fetch(`/cameras/delete/${camera.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': getCsrfToken() },
      });
      window.location.reload();
    }
  }

  return (
    <div className='mt-4'>
      <Expandable
        title={`${camera.name} (${camera.ip})`}
        actions={
          <>
            <FontAwesomeIcon icon={faPencil} onClick={editCamera} className='text-initial cursor-pointer' />
            <FontAwesomeIcon icon={faTrash} onClick={deleteCamera} className='text-red-500 cursor-pointer mx-2' />
          </>
        }
      >
        <div className='flex items-center flex-wrap'>
          {camera.presets.map((preset) => (
            <PresetDisplay key={preset.id} preset={preset} />
          ))}
          <AddPreset cameraId={camera.id} />
        </div>
      </Expandable>
    </div>
  );
}

function AddCamera(): JSX.Element {
  return (
    <div className='flex justify-center items-center p-4'>
      <a href='/cameras/new'>
        <Button>
          <FontAwesomeIcon icon={faPlus} /> Add Camera
        </Button>
      </a>
    </div>
  );
}

export function CameraList({ cameras }: { cameras: Camera[] }): JSX.Element {
  return (
    <div className='h-full flex flex-col p-4'>
      <h1>Cameras</h1>
      <div className='flex-grow overflow-auto'>
        {cameras.map((camera) => (
          <CameraDisplay key={camera.id} camera={camera} />
        ))}
        <AddCamera />
      </div>
    </div>
  );
}
