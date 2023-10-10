import { cn } from '@lib/utils';
import type { ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps } from 'react-aria-components';
import Link from './Link';

interface DefaultProps extends ButtonProps {
  variant?: 'accent' | 'primary';
}

type Props =
  | ({ as?: never } & DefaultProps)
  | ({ as: 'link'; variant?: 'accent' | 'primary' } & Parameters<
      typeof Link
    >[0]);

const baseClass =
  'px-4 py-0.5 rounded-lg transition-[background-color_outline] ease-in-out';

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  accent: 'bg-accent-500 text-neutral-100 rac-hover:bg-accent-600',
  primary: 'bg-neutral-900 text-neutral-100',
};

const disabledClass =
  'rac-disabled:bg-neutral-300 rac-disabled:text-neutral-500';

export function buildVariantClass(variant: NonNullable<Props['variant']>) {
  return cn(baseClass, variantClass[variant]);
}

export default function Button({
  className,
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
            'no-underline',
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
