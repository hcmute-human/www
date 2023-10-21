import { cn } from '@lib/utils';
import { useLocation, type UIMatch } from '@remix-run/react';
import {
  Breadcrumbs,
  type BreadcrumbsProps,
  type BreadcrumbProps,
  Breadcrumb,
} from 'react-aria-components';
import { unknown } from 'zod';
type Props = Omit<BreadcrumbsProps<BreadcrumbProps>, 'items'> & {
  items: UIMatch<unknown, RouteHandle | undefined>[];
};

function Breadscumb({ className, items, ...props }: Props) {
  return (
    <Breadcrumbs className="flex gap-2">
      {items !== undefined
        ? items
            .filter((item) => item.handle && item.handle.breadcrumb)
            .map((match, index) => (
              <Breadcrumb
                key={index}
                className={cn('gap-2 flex text-sm font-normal')}
              >
                {index > 0 ? <span>/</span> : ''}
                <div
                  className={cn({ 'font-bold': items.length - index === 2 })}
                >
                  {match.handle && typeof match.handle.breadcrumb === 'function'
                    ? match.handle.breadcrumb()
                    : ''}
                </div>
              </Breadcrumb>
            ))
        : ''}
    </Breadcrumbs>
  );
}

export default Breadscumb;
