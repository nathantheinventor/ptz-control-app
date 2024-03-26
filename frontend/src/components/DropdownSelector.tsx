type DropdownSelectorProps = {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  options: string[];
  startIndex?: number;
};

export function DropdownSelector({
  label,
  value,
  onChange,
  options,
  startIndex = 0,
}: DropdownSelectorProps): JSX.Element {
  return (
    <div className='flex flex-col pb-2'>
      <span className='text-sm text-gray-500'>{label}</span>
      <select
        value={`${value ?? null}`}
        onChange={(e) => onChange(e.target.value === 'null' ? null : Number(e.target.value))}
        className='border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out w-80'
      >
        <option value='null'>unset</option>
        {options.map((option, index) => (
          <option key={option} value={startIndex + index}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
