import { Menu, Transition } from '@headlessui/react';
import type { NavigationBarProps } from './BarEntry';
import Link from '@components/Link';
import { useLocation } from '@remix-run/react';

export default function MenuDropBar({ items }: { items: NavigationBarProps }) {
  const location = useLocation();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-blue-700 px-3 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          Menu
        </Menu.Button>
      </div>
      <Transition
        as="div"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute  mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className=" px-2 py-2">
            {items.map(({ ...item }, idx) => (
              <Menu.Item key={idx}>
                {({ active, disabled }) => (
                  <Link
                    href={item.href}
                    className={`no-underline relative flex items-center font-semibold w-full text-gray-900 p-2
                    ${
                      location.pathname.toString() === item.href &&
                      'text-blue-700 bg-slate-300 bg-opacity-30 rounded-md w-full'
                    }
                    ${
                      active
                        ? 'text-blue-700 bg-slate-300 bg-opacity-30 rounded-md w-full'
                        : ''
                    }
                  `}
                  >
                    {item.Icon}
                    <span>{item.text}</span>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
