import { cn } from '@lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export default function Column({ className, ...props }: Props) {
  return (
    <th
      {...props}
      className={cn(
        'sticky top-0 px-4 py-2 border-b border-primary-200 bg-primary-50 font-bold text-left cursor-default first:rounded-tl last:rounded-tr whitespace-nowrap outline-none',
        className
      )}
    />
  );
}
