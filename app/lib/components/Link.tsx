import { cn } from '@lib/utils';
import { forwardRef } from 'react';
import { Link as AriaLink, type LinkProps } from 'react-aria-components';

type Props = LinkProps;

const baseClass =
  'text-accent-500 underline underline-offset-2 rac-pressed:outline-none';

const Link = forwardRef<HTMLAnchorElement, Props>(
  ({ className, ...props }: Props, ref) => (
    <AriaLink
      ref={ref}
      className={cn(baseClass, className)}
      target="_self"
      {...props}
    />
  )
);

export default Link;
