import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'paper' | 'sunken';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  paper: 'paper-card',
  sunken: 'bg-bg-sunken',
};

export function Card({ variant = 'paper', className, children, ...rest }: CardProps) {
  return (
    <div className={cn('rounded-xl p-6', VARIANT_CLASS[variant], className)} {...rest}>
      {children}
    </div>
  );
}
