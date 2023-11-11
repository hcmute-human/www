import { cn } from '@lib/utils';
import { forwardRef, type ForwardedRef, type ReactNode, type Ref } from 'react';
import { Button as AriaButton, type ButtonProps } from 'react-aria-components';
import Link, { type LinkProps } from './Link';

interface BaseProps {
  size?: 'sm' | 'md';
  variant?: 'accent' | 'primary' | 'negative';
}

type DefaultProps = BaseProps & ButtonProps;

type Props =
  | ({ as?: never } & DefaultProps)
  | ({ as: 'link' } & BaseProps & Omit<LinkProps, 'href'> & { href: string });

const baseClass =
  'leading-none rounded-lg transition-[background-color_outline] ease-in-out font-medium';

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  accent: 'bg-accent-500 text-primary-100 hover:bg-accent-600',
  primary: 'bg-primary-900 text-primary-100',
  negative: 'bg-negative-500 text-primary-100',
};

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'p-1',
  md: 'px-4 py-2',
};

const disabledClass = 'disabled:bg-primary-300 disabled:text-primary-500';

export function buildVariantClass(variant: NonNullable<Props['variant']>) {
  return cn(baseClass, variantClass[variant]);
}

function Button(
  { className, size = 'md', variant = 'accent', ...props }: Props,
  ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let node: ReactNode;
  switch (props.as) {
    case 'link': {
      node = (
        <Link
          {...props}
          ref={ref as Ref<HTMLAnchorElement>}
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
          ref={ref as Ref<HTMLButtonElement>}
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

export default forwardRef(Button);
