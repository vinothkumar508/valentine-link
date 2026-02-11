'use client';

import { forwardRef } from 'react';

interface InputProps {
  id: string;
  label: string;
  type?: 'text' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  error?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    maxLength,
    error,
    required,
    className = '',
    inputClassName = '',
  },
  ref
) {
  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-stone-600 mb-1.5"
      >
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-stone-50 border border-stone-200
          text-stone-800 placeholder-stone-400
          focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-200
          transition-colors
          ${error ? 'border-rose-300 focus:ring-rose-400' : ''}
          ${inputClassName}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <div className="mt-1 flex justify-between items-center">
        {error ? (
          <p id={`${id}-error`} className="text-sm text-rose-500" role="alert">
            {error}
          </p>
        ) : (
          <span />
        )}
        <span className="text-xs text-stone-400 tabular-nums">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
});
