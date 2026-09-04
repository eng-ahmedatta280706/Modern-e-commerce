import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline-solid' | 'ghost' | 'danger';
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
  primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs hover:shadow-card-hover disabled:bg-brand-300',
  secondary: 'bg-ink hover:bg-slate-800 text-white disabled:bg-slate-400',
  outline: 'border border-slate-300 hover:border-brand-400 hover:text-brand-700 text-ink-soft disabled:opacity-50',
  ghost: 'hover:bg-slate-100 text-ink-soft disabled:opacity-50',
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
      inline-flex items-center justify-center gap-2 font-semibold rounded-xl
      transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2
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
