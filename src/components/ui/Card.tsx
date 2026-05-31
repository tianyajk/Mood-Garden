import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'solid' | 'glass' | 'sunken';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  solid: 'bg-bg-elevated border border-line-soft shadow-sm',
  glass: 'glass', // 毛玻璃材质（globals.css 抽出），复用避免重复样式
  sunken: 'bg-bg-sunken',
};

/** 通用卡片容器：默认大圆角 + 24 内边距，glass 变体复用毛玻璃材质 */
export function Card({ variant = 'solid', className, children, ...rest }: CardProps) {
  return (
    <div className={cn('rounded-lg p-6', VARIANT_CLASS[variant], className)} {...rest}>
      {children}
    </div>
  );
}
