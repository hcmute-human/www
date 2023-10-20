import { Menu, Transition } from '@headlessui/react';
import Link from '@components/Link';
import { useState } from 'react';
import { BellIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';

export default function ToolBar() {
  const { t } = useTranslation('home');
  const [items] = useState([
    {
      text: t('logout'),
      href: '/',
    },
    {
      text: t('notification'),
      href: '/',
    },
  ]);

  return (
    <div className="self-center justify-end items-center lg:p-4 flex gap-3">
      <div className="">
        <div className="border-solid border-primary-950 border-[1px] p-2 rounded-full relative bg-primary-100 bg-opacity-50 border-opacity-20">
          <div className="h-2 aspect-square bg-blue-500 right-2 rounded-full absolute" />
          <BellIcon className="h-5 w-5"></BellIcon>
        </div>
      </div>
      <Menu as="div" className="relative w-fit">
        <Menu.Button className="w-full flex gap-2 rounded-md p-2 items-center">
          <div className="h-8 aspect-square bg-primary-950 rounded-full" />
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
          className="absolute left-full -translate-x-full"
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
