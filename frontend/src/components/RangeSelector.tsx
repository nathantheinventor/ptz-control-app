import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

type RangeSelectorProps = {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
  postfix?: string;
  notNull?: boolean;
};
export function RangeSelector({
  label,
  value,
  onChange,
  min,
  max,
  postfix = '',
  notNull = false,
}: RangeSelectorProps): JSX.Element {
  const disabled = value == null;

  const toggleDisabled = () => onChange(disabled ? min : null);

  function promptValue() {
    const input = prompt('Enter a value', value?.toString() ?? '');
    if (input != null) {
      onChange(Number(input));
    }
  }

  return (
    <div className='flex flex-col pb-2'>
      <span className='text-sm text-gray-500'>{label}</span>
      <div className='flex align-center items-center'>
        {!notNull && <input type='checkbox' checked={!disabled} onChange={toggleDisabled} className='mr-2' />}
        <FontAwesomeIcon
          className='cursor-pointer'
          icon={faMinus}
          onClick={value != null ? () => onChange(Math.max(min, value - 1)) : undefined}
        />
        <input
          type='range'
          value={value ?? min}
          disabled={!notNull && disabled}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className='border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out !w-[800px] !mx-2'
          min={min}
          max={max}
        />
        <FontAwesomeIcon
          className='cursor-pointer'
          icon={faPlus}
          onClick={value != null ? () => onChange(Math.min(max, value + 1)) : undefined}
        />
        <span className={`ml-2 cursor-pointer ${disabled ? 'text-gray-500' : ''}`} onClick={promptValue}>
          {value != null ? `${value}${postfix}` : 'unset'}
        </span>
      </div>
    </div>
  );
}
