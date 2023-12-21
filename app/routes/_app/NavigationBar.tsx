import { useLocation } from '@remix-run/react';
import { useId } from 'react';
import NavigationBarItem from './NavigationBarItem';
import type { INavigationBarItem } from './types';

type Props = {
  items: INavigationBarItem[];
  layoutId: string;
};

export default function NavigationBar({ items, layoutId }: Props) {
  const { pathname } = useLocation();
  const rootPathName = pathname.split('/', 2).join('/') ?? '/';

  return (
    <nav>
      <ul className="flex gap-1 lg:block lg:space-y-1">
        {items.map((item) => (
          <NavigationBarItem
            key={item.href}
            item={item}
            isActive={item.href.startsWith(rootPathName)}
            layoutId={layoutId}
          />
        ))}
      </ul>
    </nav>
  );
}
