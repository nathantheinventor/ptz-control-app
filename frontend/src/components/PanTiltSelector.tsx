import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';

type PanTileSelectorProps = {
  pan: number;
  tilt: number;
  onChange: (pan: number, tilt: number) => void;
};

const CANVAS_WIDTH = 34 * 16;
const CANVAS_HEIGHT = 12 * 16;
const MIN_PAN = -2447;
const MAX_PAN = 2448;
const MIN_TILT = -430;
const MAX_TILT = 1296;
const MAX_SCALE = 144;

export function PanTiltSelector({ pan, tilt, onChange }: PanTileSelectorProps): JSX.Element {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const xMin = useRef(MIN_PAN);
  const yMin = useRef(MIN_TILT);
  const scale = useRef(MAX_SCALE);

  function draw() {
    const xMax = Math.min(MAX_PAN, xMin.current + scale.current * 34);
    const yMax = Math.min(MAX_TILT, yMin.current + scale.current * 12);
    const xValToPixel = (value: number) => (CANVAS_WIDTH * (value - xMin.current)) / (xMax - xMin.current);
    const yValToPixel = (value: number) =>
      CANVAS_HEIGHT - (CANVAS_HEIGHT * (value - yMin.current)) / (yMax - yMin.current);

    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    if (canvas.current!.width !== CANVAS_WIDTH) {
      canvas.current!.width = CANVAS_WIDTH;
      canvas.current!.height = CANVAS_HEIGHT;
    }
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw axis lines
    ctx.fillStyle = 'black';
    ctx.fillRect(xValToPixel(0) - 0.5, 0, 1, CANVAS_HEIGHT);
    ctx.fillRect(0, yValToPixel(0) - 0.5, CANVAS_WIDTH, 1);

    // Draw dot where camera is currently
    ctx.fillStyle = 'red';
    ctx.fillRect(xValToPixel(pan) - 2, yValToPixel(tilt) - 2, 4, 4);

    // Draw minor grid lines
    let minorSpacingDegrees = 20;
    if (scale.current < 72) minorSpacingDegrees = 10;
    if (scale.current < 36) minorSpacingDegrees = 5;
    if (scale.current < 15) minorSpacingDegrees = 2;
    if (scale.current < 7.2) minorSpacingDegrees = 1;

    const minorSpacingPoints = minorSpacingDegrees * 14.4;
    const startMinorX = Math.ceil(xMin.current / minorSpacingPoints) * minorSpacingPoints;
    const startMinorY = Math.ceil(yMin.current / minorSpacingPoints) * minorSpacingPoints;

    let markerYPosition = 10;
    if (yMin.current < 0 && yMax > 0) {
      if (Math.abs(yMax) < Math.abs(yMin.current)) markerYPosition = yValToPixel(0) + 10;
      else markerYPosition = yValToPixel(0) - 4;
    } else if (yMin.current > 0) {
      markerYPosition = CANVAS_HEIGHT - 4;
    }
    for (let i = startMinorX; i < xMax; i += minorSpacingPoints) {
      if (Math.abs(i) < 1e-6) continue;
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(xValToPixel(i) - 0.5, 0, 1, CANVAS_HEIGHT);
      ctx.fillStyle = 'gray';
      ctx.fillText((i / 14.4 + 1e-6).toFixed(0) + '°', xValToPixel(i) + 2, markerYPosition);
    }

    let markerXPosition = 2;
    if (xMin.current < 0 && xMax > 0) {
      if (Math.abs(xMax) > Math.abs(xMin.current)) markerXPosition = xValToPixel(0) + 2;
      else markerXPosition = xValToPixel(0) - 20;
    } else if (xMin.current < 0) {
      markerXPosition = CANVAS_WIDTH - 20;
    }
    for (let i = startMinorY; i < yMax; i += minorSpacingPoints) {
      if (Math.abs(i) < 1e-6) continue;
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(0, yValToPixel(i) - 0.5, CANVAS_WIDTH, 1);
      ctx.fillStyle = 'gray';
      ctx.fillText((i / 14.4 + 1e-6).toFixed(0) + '°', markerXPosition, yValToPixel(i) + 10);
    }

    // Draw points you can select
    if (scale.current < 3) {
      ctx.fillStyle = 'gray';
      for (let i = Math.ceil(xMin.current); i < xMax; i++) {
        for (let j = Math.ceil(yMin.current); j < yMax; j++) {
          ctx.fillRect(xValToPixel(i) - 0.5, yValToPixel(j) - 0.5, 1, 1);
        }
      }
    }
  }

  useEffect(draw, [pan, tilt]);

  function onClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvas.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xMax = Math.min(MAX_PAN, xMin.current + scale.current * 34);
    const yMax = Math.min(MAX_TILT, yMin.current + scale.current * 12);
    const xPixelToVal = (pixel: number) => xMin.current + (pixel / CANVAS_WIDTH) * (xMax - xMin.current);
    const yPixelToVal = (pixel: number) =>
      yMin.current + ((CANVAS_HEIGHT - pixel) / CANVAS_HEIGHT) * (yMax - yMin.current);

    const pan = Math.min(MAX_PAN, Math.max(MIN_PAN, Math.round(xPixelToVal(x))));
    const tilt = Math.min(MAX_TILT, Math.max(MIN_TILT, Math.round(yPixelToVal(y))));
    onChange(pan, tilt);
  }

  const onScroll = useRef<(event: HTMLElementEventMap['wheel']) => void>();
  onScroll.current = (event: HTMLElementEventMap['wheel']) => {
    event.preventDefault();

    const rect = canvas.current?.getBoundingClientRect();
    if (!rect) return;
    const xPx = event.clientX - rect.left;
    const yPx = event.clientY - rect.top;

    const previousScale = scale.current;
    let newScale = 0;
    if (event.deltaY > 0) newScale = Math.min(MAX_SCALE, previousScale * 1.1);
    else newScale = Math.max(1, previousScale / 1.1);
    scale.current = newScale;

    // Get the point where our mouse is
    const xMax = Math.min(MAX_PAN, xMin.current + previousScale * 34);
    const yMax = Math.min(MAX_TILT, yMin.current + previousScale * 12);
    const xPoint = xMin.current + (xPx / CANVAS_WIDTH) * (xMax - xMin.current);
    const yPoint = yMin.current + ((CANVAS_HEIGHT - yPx) / CANVAS_HEIGHT) * (yMax - yMin.current);

    // Adjust corners such that the point is at the same pixel location after scaling
    const pointWidth = (newScale * 34) / CANVAS_WIDTH;
    const pointHeight = (newScale * 12) / CANVAS_HEIGHT;
    xMin.current = Math.max(MIN_PAN, Math.min(MAX_PAN - newScale * 34, xPoint - pointWidth * xPx));
    yMin.current = Math.max(MIN_TILT, Math.min(MAX_TILT - newScale * 12, yPoint - pointHeight * (CANVAS_HEIGHT - yPx)));

    draw();
  };

  useEffect(() => {
    const element = canvas.current;
    const listener = (event: HTMLElementEventMap['wheel']) => onScroll.current?.(event);
    if (element) element.addEventListener('wheel', listener);
    return () => {
      if (element) element.removeEventListener('wheel', listener);
    };
  }, [canvas]);

  return (
    <div className='flex flex-col pb-2'>
      <span className='text-sm text-gray-500'>Pan / Tilt Selector</span>
      <div className='flex items-center'>
        <div className='p-2 hover:bg-gray-100 mr-2 cursor-pointer'>
          <FontAwesomeIcon icon={faChevronLeft} onClick={() => onChange(Math.max(MIN_PAN, pan - 1), tilt)} />
        </div>
        <div className='flex flex-col items-center'>
          <div className='p-2 hover:bg-gray-100 mb-2 cursor-pointer'>
            <FontAwesomeIcon icon={faChevronUp} onClick={() => onChange(pan, Math.min(MAX_TILT, tilt + 1))} />
          </div>
          <canvas className='w-[34em] h-[12em]' ref={canvas} onClick={onClick} />
          <div className='p-2 hover:bg-gray-100 mt-2 cursor-pointer'>
            <FontAwesomeIcon icon={faChevronDown} onClick={() => onChange(pan, Math.max(MIN_TILT, tilt - 1))} />
          </div>
        </div>
        <div className='p-2 hover:bg-gray-100 ml-2 cursor-pointer'>
          <FontAwesomeIcon icon={faChevronRight} onClick={() => onChange(Math.min(MAX_PAN, pan + 1), tilt)} />
        </div>
      </div>
      <span className='text-sm font-bold'>Pan: {(pan / 14.4).toFixed(2)}&deg;</span>
      <span className='text-sm font-bold'>Tilt: {(tilt / 14.4).toFixed(2)}&deg;</span>
    </div>
  );
}
