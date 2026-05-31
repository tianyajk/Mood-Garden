import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    'bg-ink-900 text-[#FFFDF7] hover:bg-[#2D261E] shadow-sm disabled:bg-ink-400',
  secondary:
    'bg-[#FFFDF7] text-ink-900 border border-line-soft hover:bg-bg-sunken shadow-sm',
  ghost:
    'text-ink-600 hover:text-ink-900 hover:bg-bg-sunken',
};

const SIZE_CLASS: Record<Size, string> = {
  md: 'h-10 px-5 text-body rounded-xl',
  lg: 'h-12 px-8 text-body-lg rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
