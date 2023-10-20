import Link from '@components/Link';
import { Menu, Transition } from '@headlessui/react';
import { useLocation } from '@remix-run/react';
import type { INavigationBarItem } from './types';

export default function MenuDropBar({
  items,
}: {
  items: INavigationBarItem[];
}) {
  const { pathname } = useLocation();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="w-full justify-center rounded-md bg-accent-500 px-3 text-primary-50 rac-focus-visible:focus-outline">
        Menu
      </Menu.Button>
      <Transition
        as="div"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute mt-2 rounded-md bg-primary-0 p-1 border border-primary-200">
          {items.map(({ ...item }, idx) => (
            <Menu.Item key={idx}>
              {() => (
                <Link
                  href={item.href}
                  className={`no-underline relative flex items-center p-2
                    ${
                      pathname.toString() === item.href
                        ? 'text-accent-500 bg-primary-50 rounded-md w-full'
                        : 'text-primary-700'
                    }
                  `}
                >
                  {item.icon}
                  <span className="ml-1">{item.text}</span>
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
