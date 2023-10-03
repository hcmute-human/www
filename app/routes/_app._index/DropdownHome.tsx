import React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from '@components/Link';
import { Menu, Transition } from '@headlessui/react';
import type { PropsItemNavgigate } from './NavigationBar';

type NavigationBarProps = {
  items: Array<PropsItemNavgigate>;
};

function DropdownHome(props: NavigationBarProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu open/close

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left sm:hidden">
        <div>
          <Menu.Button
            onClick={toggleMenu}
            className="inline-flex w-full justify-center rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:scale-90 duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Options
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          show={isMenuOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            static
          >
            <div className="px-2 py-2">
              {props.items.map((i, idx) => (
                <Menu.Item key={idx}>
                  {({ active }) => (
                    <div className="relative flex items-center justify-start m-1">
                      {location.pathname === i.href && (
                        <div
                          className={
                            'h-full w-full bg-slate-400 bg-opacity-10 absolute rounded-md'
                          }
                        ></div>
                      )}
                      {active && (
                        <div
                          className={
                            'h-full w-full bg-slate-400 bg-opacity-10 absolute rounded-md'
                          }
                        ></div>
                      )}
                      <Link
                        as="navlink"
                        to={i.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`${
                          location.pathname === i.href
                            ? 'text-primary-500'
                            : active
                            ? 'text-primary-500'
                            : 'text-opacity-60 text-gray-950'
                        } no-underline relative flex p-2 gap-2 w-full font-bold items-center`}
                      >
                        {i.Icon}
                        <p className="m-0 lg:flex flex sm:hidden">{i.text}</p>
                      </Link>
                    </div>
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

export default DropdownHome;
