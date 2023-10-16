import { cn } from '@lib/utils';
import { forwardRef } from 'react';
import { type LinkProps } from 'react-aria-components';
import Link from './Link';

type Props = LinkProps;

const baseClass = 'text-accent-500 hover:underline hover:underline-offset-2';

const TextLink = forwardRef<HTMLAnchorElement, Props>(
  ({ className, ...props }: Props, ref) => (
    <Link ref={ref} className={cn(baseClass, className)} {...props} />
  )
);

export default TextLink;
