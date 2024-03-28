import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  onClick?: () => void;
  children?: React.ReactNode;
  secondary?: boolean;
};

export function Button({ onClick, children, secondary, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`bg-blue-500 text-white rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out mr-4 ${
        secondary ? 'bg-gray-500' : ''
      }`}
    >
      {children}
    </button>
  );
}
