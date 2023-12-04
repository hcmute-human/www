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
        'sticky z-10 top-0 px-4 py-2 group-hover:bg-red-500 border-l first-of-type:border-l-0 border-primary-100 font-semibold text-left cursor-default first:rounded-tl last:rounded-tr whitespace-nowrap outline-none',
        className
      )}
    />
  );
}
