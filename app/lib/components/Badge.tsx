import { cn } from '@lib/utils';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'negative';
  size?: 'xs' | 'sm' | 'base';
}

const baseClass = 'px-1 font-bold rounded';
const variantClass = {
  negative: 'text-primary-50 bg-negative-500',
};
const sizeClass = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: undefined,
};

export default function Badge({ variant = 'negative', size = 'base', className, children, ...props }: Props) {
  return (
    <span {...props} className={cn(baseClass, variantClass[variant], sizeClass[size], className)}>
      {children}
    </span>
  );
}
