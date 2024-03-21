type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextInput({
  label,
  value,
  onChange,
}: TextInputProps): JSX.Element {
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
