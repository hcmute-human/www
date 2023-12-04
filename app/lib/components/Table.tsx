import { cn } from '@lib/utils';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableElement> {}

export default function Table({ className, ...props }: Props) {
  return (
    <table
      {...props}
      className={cn('border border-primary-100 rounded-lg border-separate border-spacing-0', className)}
    />
  );
}
