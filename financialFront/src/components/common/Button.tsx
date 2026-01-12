import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantColors = {
    primary: { bg: '#3B82F6', hover: '#2563EB', ring: '#3B82F6' },
    secondary: { bg: '#8B5CF6', hover: '#7C3AED', ring: '#8B5CF6' },
    danger: { bg: '#EF4444', hover: '#DC2626', ring: '#EF4444' },
    ghost: { bg: 'transparent', hover: 'rgb(243, 244, 246)', ring: '#D1D5DB' }
  };

  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const colors = variantColors[variant];
  const isGhost = variant === 'ghost';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${className} ${isGhost ? 'border border-gray-300 text-gray-700' : 'text-white'}`}
      style={{ backgroundColor: colors.bg }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) e.currentTarget.style.backgroundColor = colors.hover;
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) e.currentTarget.style.backgroundColor = colors.bg;
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Carregando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
