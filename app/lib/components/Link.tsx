import { cn } from '@lib/utils';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Link as AriaLink } from 'react-aria-components';
import {
  Link as RemixLink,
  type LinkProps,
  type NavLinkProps,
  NavLink,
} from '@remix-run/react';

type Props =
  | ({ as?: 'link' } & LinkProps)
  | ({ as: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ as?: 'navlink' } & NavLinkProps);

const baseClass = 'text-accent-500 underline underline-offset-2';

export default function Link({ className, as = 'link', ...props }: Props) {
  let node: ReactNode | null = null;
  switch (as) {
    case 'link': {
      node = <RemixLink {...(props as LinkProps)} />;
      break;
    }
    case 'a': {
      node = <a {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
      break;
    }
    case 'navlink': {
      node = <NavLink {...(props as NavLinkProps)} />;
      break;
    }
  }

  return <AriaLink className={cn(baseClass, className)}>{node}</AriaLink>;
}
