import { cn } from '@lib/utils';
import { forwardRef } from 'react';
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';

export type LinkProps = AriaLinkProps;

const baseClass = 'no-underline pressed:outline-none';

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }: LinkProps, ref) => (
    <AriaLink
      ref={ref}
      className={cn(baseClass, className)}
      target="_self"
      {...props}
    />
  )
);

export default Link;
