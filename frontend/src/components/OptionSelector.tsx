type OptionProps = {
  value: number | null;
  selected: boolean;
  onSelect: (value: number | null) => void;
};

function Option({ value, selected, onSelect }: OptionProps): JSX.Element {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`p-2 focus:outline-none hover:bg-blue-400 transition duration-150 ease-in-out ${
        selected
          ? "bg-blue-500 hover:bg-blue-500 text-white"
          : "bg-gray-500 text-gray-200"
      }`}
    >
      {value ?? "default"}
    </button>
  );
}

type OptionSelectorProps = {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  options: number[];
};

export function OptionSelector({
  label,
  value,
  onChange,
  options,
}: OptionSelectorProps): JSX.Element {
  return (
    <div className="flex flex-col pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md">
        <Option value={null} selected={value == null} onSelect={onChange} />
        {options.map((option) => (
          <Option
            value={option}
            key={option}
            selected={value === option}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  );
}
