'use client';

import { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant: 'primary' | 'secondary' | 'ghost' | 'yes' | 'no';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  'aria-label'?: string;
}

const base =
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] min-h-[48px] min-w-[44px] touch-manipulation disabled:opacity-55 disabled:cursor-not-allowed disabled:active:scale-100';

const variants = {
  primary:
    'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-soft hover:from-rose-600 hover:to-rose-700',
  secondary:
    'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200',
  ghost: 'bg-transparent text-stone-600 hover:bg-stone-100',
  yes: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-soft hover:from-rose-600 hover:to-pink-600 text-lg px-8 py-4 rounded-2xl',
  no: 'bg-stone-200/80 text-stone-600 hover:bg-stone-300/80 text-base px-6 py-3 rounded-2xl',
};

export function Button({
  children,
  onClick,
  type = 'button',
  variant,
  className = '',
  style,
  disabled,
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
