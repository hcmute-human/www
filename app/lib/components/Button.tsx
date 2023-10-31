import { cn } from '@lib/utils';
import type { ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps } from 'react-aria-components';
import Link from './Link';

interface BaseProps {
  size?: 'sm' | 'md';
  variant?: 'accent' | 'primary' | 'negative';
}

type DefaultProps = BaseProps & ButtonProps;

type Props =
  | ({ as?: never } & DefaultProps)
  | ({ as: 'link' } & BaseProps & Parameters<typeof Link>[0]);

const baseClass =
  'leading-none rounded-lg transition-[background-color_outline] ease-in-out font-medium';

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  accent: 'bg-accent-500 text-primary-100 rac-hover:bg-accent-600',
  primary: 'bg-primary-900 text-primary-100',
  negative: 'bg-negative-500 text-primary-100',
};

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'p-1',
  md: 'px-4 py-2',
};

const disabledClass =
  'rac-disabled:bg-primary-300 rac-disabled:text-primary-500';

export function buildVariantClass(variant: NonNullable<Props['variant']>) {
  return cn(baseClass, variantClass[variant]);
}

export default function Button({
  className,
  size = 'md',
  variant = 'accent',
  ...props
}: Props) {
  let node: ReactNode;
  switch (props.as) {
    case 'link': {
      node = (
        <Link
          {...props}
          className={cn(
            baseClass,
            variantClass[variant],
            sizeClass[size],
            className
          )}
        />
      );
      break;
    }
    default: {
      node = (
        <AriaButton
          {...props}
          className={cn(
            baseClass,
            variantClass[variant],
            sizeClass[size],
            disabledClass,
            className
          )}
        />
      );
      break;
    }
  }

  return node;
}
