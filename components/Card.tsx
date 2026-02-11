'use client';

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6 sm:p-8',
  lg: 'p-8 sm:p-10',
};

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        w-full max-w-lg mx-auto
        rounded-2xl sm:rounded-3xl
        bg-white/95 backdrop-blur-sm
        shadow-card
        border border-white/80
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
