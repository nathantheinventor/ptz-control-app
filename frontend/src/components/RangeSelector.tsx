type RangeSelectorProps = {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
};
export function RangeSelector({
  label,
  value,
  onChange,
  min,
  max,
}: RangeSelectorProps): JSX.Element {
  const disabled = value == null;

  const toggleDisabled = () => onChange(disabled ? min : null);

  return (
    <div className="flex flex-col pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex align-center">
        <input
          type="checkbox"
          checked={!disabled}
          onChange={toggleDisabled}
          className="mr-2"
        />
        <input
          type="range"
          value={value ?? min}
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out w-80"
          min={min}
          max={max}
        />
        <span className={`ml-2 ${disabled ? "text-gray-500" : ""}`}>
          {value ?? "default"}
        </span>
      </div>
    </div>
  );
}
