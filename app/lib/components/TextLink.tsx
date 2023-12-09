import { cn } from '@lib/utils';
import { forwardRef } from 'react';
import { type LinkProps } from 'react-aria-components';
import Link from './Link';

interface Props extends LinkProps {
  variant?: 'accent' | 'primary' | 'info';
}

const baseClass = 'hover:underline hover:underline-offset-2';
const variantClass = {
  info: 'text-info-500',
  accent: 'text-accent-500',
  primary: 'text-primary-700',
};

const TextLink = forwardRef<HTMLAnchorElement, Props>(({ className, variant = 'accent', ...props }: Props, ref) => (
  <Link ref={ref} className={cn(baseClass, variantClass[variant], className)} {...props} />
));

export default TextLink;
