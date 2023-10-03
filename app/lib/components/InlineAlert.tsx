import { cn } from '@lib/utils';
import type { FC, HTMLAttributes } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title: string;
  body: string;
  className?: string;
  variant?: 'positive' | 'negative';
}

const baseClass =
  'px-4 py-2 border-2 bg-neutral-50 rounded duration-500 animate-in fade-in';
const variantClass: Record<NonNullable<Props['variant']>, string> = {
  positive: 'border-positive-500',
  negative: 'border-negative-500',
};

const InlineAlert: FC<Props> = ({
  title,
  body,
  variant = 'positive',
  className,
  ...props
}) => {
  return (
    <div {...props} className={cn(baseClass, variantClass[variant], className)}>
      <h2 className="text-base font-bold leading-body mb-2">{title}</h2>
      <p className="text-neutral-700">{body}</p>
    </div>
  );
};

export default InlineAlert;
