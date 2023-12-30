import { cn } from '@lib/utils';
import { forwardRef, type ForwardedRef, type ReactNode, type Ref } from 'react';
import { Button as AriaButton, type ButtonProps } from 'react-aria-components';
import Link, { type LinkProps } from './Link';

interface BaseProps {
  size?: 'sm' | 'md';
  variant?: 'accent' | 'primary' | 'positive' | 'negative' | 'info';
  outlined?: boolean;
}

type DefaultProps = BaseProps & ButtonProps;

type Props =
  | ({ as?: never } & DefaultProps)
  | ({ as: 'link' } & BaseProps & Omit<LinkProps, 'href'> & { href: string });

export type ButtonProps = Props;

const baseClass = 'leading-none rounded-md transition-[background-color_outline] ease-in-out font-medium';

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  accent: 'bg-accent-500 text-primary-100 hover:bg-accent-600',
  primary: 'bg-primary-900 text-primary-100',
  positive: 'bg-positive-500 text-primary-100',
  negative: 'bg-negative-500 text-primary-100',
  info: 'bg-info-500 text-primary-100',
};

const outlineClass: Record<NonNullable<Props['variant']>, string> = {
  accent: 'text-accent-500 border border-accent-300 hover:border-accent-500',
  primary: 'text-primary-950 border border-primary-300 hover:border-primary-700',
  positive: 'text-positive-500 border border-positive-200 hover:border-positive-500',
  negative: 'text-negative-500 border border-negative-200 hover:border-negative-500',
  info: 'text-info-500 border border-info-200 hover:border-info-500',
};

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'p-0.5',
  md: 'px-4 py-2',
};

const disabledClass = 'disabled:bg-primary-300 disabled:text-primary-500';

export function buildVariantClass(variant: NonNullable<Props['variant']>) {
  return cn(baseClass, variantClass[variant]);
}

function Button(
  { className, size = 'md', variant = 'accent', outlined = false, ...props }: Props,
  ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let node: ReactNode;
  className = cn(
    baseClass,
    outlined ? outlineClass[variant] : variantClass[variant],
    sizeClass[size],
    disabledClass,
    className
  );
  switch (props.as) {
    case 'link': {
      node = <Link {...props} ref={ref as Ref<HTMLAnchorElement>} className={className} />;
      break;
    }
    default: {
      node = <AriaButton {...props} ref={ref as Ref<HTMLButtonElement>} className={className} />;
      break;
    }
  }

  return node;
}

export default forwardRef(Button);
