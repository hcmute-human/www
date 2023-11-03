import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid';
import { cn } from '@lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title: string;
  body?: string;
  variant?: 'positive' | 'negative';
}

const baseClass = 'px-4 py-2 border-2 bg-primary-0 rounded duration-500';
const variantClass: Record<NonNullable<Props['variant']>, string> = {
  positive: 'border-positive-500',
  negative: 'border-negative-500',
};

export default function BoxAlert({
  title,
  body,
  variant = 'positive',
  className,
  ...props
}: Props) {
  let icon: ReactNode | null = null;
  switch (variant) {
    case 'positive': {
      icon = <CheckCircleIcon className="w-5 h-5 text-positive-500" />;
      break;
    }
    case 'negative': {
      icon = <ExclamationCircleIcon className="w-5 h-5 text-negative-500" />;
      break;
    }
  }

  return (
    <div {...props} className={cn(baseClass, variantClass[variant], className)}>
      <div className="flex gap-4 justify-between items-center">
        <h4 className="text-base font-bold leading-body">{title}</h4>
        {icon}
      </div>
      {body ? <p className="mt-4">{body}</p> : null}
    </div>
  );
}
