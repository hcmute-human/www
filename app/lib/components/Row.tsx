import { cn } from '@lib/utils';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableRowElement> {}

export default function Row({ className, ...props }: Props) {
  return <tr {...props} className={cn('hover:bg-primary-50/40', className)} />;
}
