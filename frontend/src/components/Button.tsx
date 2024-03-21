type ButtonProps = { onClick?: () => void; children?: React.ReactNode };
export function Button({ onClick, children }: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out"
    >
      {children}
    </button>
  );
}
