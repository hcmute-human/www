import { Menu, Transition } from '@headlessui/react';
import Link from '@components/Link';
import { useState } from 'react';

export default function ToolBar() {
  const [items] = useState([
    {
      text: 'Logout',
      href: '/',
    },
    {
      text: 'Notification',
      href: '/',
    },
  ]);

  return (
    <div className="self-start">
      <Menu as="div" className="relative w-full">
        <Menu.Button className="w-full flex gap-2 rounded-md p-2 items-center">
          <div className="h-5 aspect-square bg-primary-950 rounded-full" />
          <div className="lg:block hidden">User@gmail.com</div>
        </Menu.Button>
        <Transition
          as="div"
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          className="absolute lg:top-full lg:-translate-y-full lg:left-full lg:translate-x-0 left-full -translate-x-full"
        >
          <Menu.Items className="gap-4 p-1 w-fit rounded-md bg-primary-0 border border-primary-200">
            {items.map(({ ...item }, idx) => (
              <Menu.Item key={idx}>
                {({ active, disabled }) => (
                  <Link
                    href={item.href}
                    className={`no-underline relative flex items-center w-full text-primary-700 p-2
                    ${
                      active
                        ? 'text-accent-500 bg-primary-50 rounded-md w-full'
                        : ''
                    }
                  `}
                  >
                    <span>{item.text}</span>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
