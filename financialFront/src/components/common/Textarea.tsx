import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`
          block w-full rounded-lg border ${error ? 'border-red-300' : 'border-gray-300'}
          px-3 py-2
          focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary focus:border-primary'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-base
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
