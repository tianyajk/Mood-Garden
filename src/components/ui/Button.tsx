import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'glass';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    'bg-brand-green text-white hover:bg-brand-green-deep shadow-md disabled:bg-ink-400',
  secondary:
    'bg-bg-elevated text-ink-900 border border-line-soft hover:bg-bg-sunken',
  glass: 'glass text-ink-900 hover:shadow-glow',
};

const SIZE_CLASS: Record<Size, string> = {
  md: 'h-11 px-5 text-body',
  lg: 'h-12 px-8 text-body-lg',
};

/** 通用按钮：五态齐全（hover/active/focus/disabled），触控 ≥44px */
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
        'inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-70',
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
