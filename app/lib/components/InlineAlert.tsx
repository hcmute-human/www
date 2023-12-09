import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { cn } from '@lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  text: string;
  iconPlacement?: 'left' | 'right';
  variant?: 'positive' | 'negative';
}

const baseClass = 'flex gap-2 items-center text-base';
const variantClass: Record<NonNullable<Props['variant']>, string> = {
  positive: 'text-positive-500',
  negative: 'text-negative-500',
};

export default function InlineAlert({
  text,
  variant = 'positive',
  iconPlacement = 'left',
  className,
  ...props
}: Props) {
  let icon: ReactNode | null = null;
  switch (variant) {
    case 'positive': {
      icon = <CheckCircleIcon className="w-5 h-5" />;
      break;
    }
    case 'negative': {
      icon = <ExclamationCircleIcon className="w-5 h-5" />;
      break;
    }
  }
  return (
    <div
      {...props}
      className={cn(baseClass, variantClass[variant], iconPlacement === 'left' ? '' : 'flex-row-reverse', className)}
    >
      {icon}
      <p className="font-bold leading-body">{text}</p>
    </div>
  );
}
