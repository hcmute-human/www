import { cn } from '@lib/utils';
import { forwardRef } from 'react';
import { Link as AriaLink, type LinkProps } from 'react-aria-components';

const baseClass = 'text-tertiary-500 underline underline-offset-2 text-sm';

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, ...props }: LinkProps,
  ref
) {
  return <AriaLink {...props} ref={ref} className={cn(baseClass, className)} />;
});

export default Link;
