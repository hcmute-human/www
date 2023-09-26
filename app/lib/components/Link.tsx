import { cn } from '@lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';
import { Link as AriaLink } from 'react-aria-components';
import { Link as RemixLink, type LinkProps } from '@remix-run/react';

type Props =
  | ({ as?: 'link' } & LinkProps)
  | ({ as: 'a' } & HTMLAttributes<HTMLAnchorElement>);

const baseClass = 'text-tertiary-500 underline underline-offset-2 text-sm';

export default function Link({
  className,
  as = 'link',
  children,
  ...props
}: Props) {
  let node: ReactNode | null = null;
  switch (as) {
    case 'link': {
      node = <RemixLink {...(props as LinkProps)}>{children}</RemixLink>;
      break;
    }
    case 'a': {
      node = <a {...props}>{children}</a>;
      break;
    }
  }

  return <AriaLink className={cn(baseClass, className)}>{node}</AriaLink>;
}
