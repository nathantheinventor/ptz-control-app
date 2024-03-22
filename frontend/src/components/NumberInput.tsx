type TextInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function NumberInput({
  label,
  value,
  onChange,
}: TextInputProps): JSX.Element {
  return (
    <div className="flex flex-col pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out max-w-80"
      />
    </div>
  );
}
