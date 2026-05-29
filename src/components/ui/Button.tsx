import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300',
  secondary: 'bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-400',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50',
  ghost: 'hover:bg-gray-100 text-gray-700 disabled:opacity-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 font-medium rounded-lg
      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `.trim()}
  >
    {loading ? (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    ) : leftIcon}
    {children}
    {!loading && rightIcon}
  </button>
);

export default Button;
