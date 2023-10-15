import { Menu, Transition } from '@headlessui/react';
import type { NavigationBarProps } from './BarEntry';
import Link from '@components/Link';
import { useState } from 'react';
export default function ToolBar() {
  const [items, setItems] = useState([
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
    <div className="flex mx-auto gap-2 cursor-pointer ">
      <Menu as="div" className="relative ">
        <div>
          <Menu.Button className=" w-full flex gap-4 justify-center rounded-md  px-3 py-1 text-sm font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <div className="h-6 aspect-square bg-primary-950 rounded-full"></div>
            <div className="lg:block hidden">User@gmail.com</div>
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
          className="absolute lg:-top-[90%] lg:left-[90%] ml-8 mb-8 right-0"
        >
          <Menu.Items className="w-56 divide-y gap-2 divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-2 py-2">
              {items.map(({ ...item }, idx) => (
                <Menu.Item key={idx}>
                  {({ active, disabled }) => (
                    <Link
                      href={item.href}
                      className={`no-underline relative flex items-center font-semibold w-full text-gray-900 p-2
                    ${
                      active
                        ? 'text-blue-700 bg-slate-300 bg-opacity-30 rounded-md w-full'
                        : ''
                    }
                  `}
                    >
                      <p className="">{item.text}</p>
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
