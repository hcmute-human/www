import clsx from 'clsx';
import type { Key, ReactNode } from 'react';
import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb,
  type BreadcrumbProps,
  type BreadcrumbsProps,
} from 'react-aria-components';

type Props = Omit<BreadcrumbsProps<BreadcrumbProps>, 'items'> & {
  items: { key: Key; node: ReactNode }[];
};

export default function Breadcrumbs({ className, items, ...props }: Props) {
  return (
    <AriaBreadcrumbs {...props} className={clsx('flex gap-1', className)}>
      {items.map(({ key, node }) => (
        <Breadcrumb key={key} className="group flex gap-1 items-center">
          {node}
        </Breadcrumb>
      ))}
    </AriaBreadcrumbs>
  );
}
