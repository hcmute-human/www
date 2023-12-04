import clsx from 'clsx';
import { type Key, type OlHTMLAttributes, type ReactNode } from 'react';

type Props = OlHTMLAttributes<HTMLOListElement> & {
  items: { key: Key; node: ReactNode }[];
};

export default function Breadcrumbs({ className, items, ...props }: Props) {
  return (
    <ol {...props} className={clsx('flex gap-1 text-base', className)}>
      {items.map(({ key, node }) => (
        <li key={key} className="group flex items-center gap-1">
          {node}
        </li>
      ))}
    </ol>
    // <AriaBreadcrumbs {...props} items={items} className={clsx('flex gap-1', className)}>
    //   {({ key, node }) => (
    //     <Breadcrumb key={key} className="group flex gap-1 items-center">
    //       {node}
    //     </Breadcrumb>
    //   )}
    // </AriaBreadcrumbs>
  );
}
