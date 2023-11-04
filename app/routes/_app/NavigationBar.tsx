import { useLocation } from '@remix-run/react';
import NavigationBarItem from './NavigationBarItem';
import type { INavigationBarItem } from './types';

type Props = {
  items: INavigationBarItem[];
};

export default function NavigationBar({ items }: Props) {
  const { pathname } = useLocation();
  const rootPathName = pathname.split('/', 2).join('/');

  return (
    <nav>
      <ul className="flex gap-1 lg:block lg:space-y-1">
        {items.map((item) => (
          <NavigationBarItem
            key={item.href}
            item={item}
            isActive={rootPathName === item.href}
          />
        ))}
      </ul>
    </nav>
  );
}
