import { cn } from '@lib/utils';
import type { TdHTMLAttributes } from 'react';

interface Props extends TdHTMLAttributes<HTMLTableCellElement> {}

export default function Cell({ className, ...props }: Props) {
  return (
    <td
      {...props}
      className={cn(
        'px-4 py-2 border-b border-b-primary-100 truncate focus-visible:outline-focus focus-visible:-outline-offset-4 group-selected:focus-visible:outline-focus',
        className
      )}
    />
  );
}
