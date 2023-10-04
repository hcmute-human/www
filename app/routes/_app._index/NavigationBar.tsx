import { useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import Link from '@components/Link';
import DropdownHome from './DropdownHome';

export interface PropsItemNavgigate {
  text: string;
  href: string;
  Icon: any;
}
type NavigationBarProps = {
  items: Array<PropsItemNavgigate>;
};

const NavigationBar = (props: NavigationBarProps) => {
  const location = useLocation();

  return (
    <div className="">
      <div className="sm:hidden flex px-4 py-5">
        <DropdownHome items={props.items}></DropdownHome>
      </div>
      <ul className=" lg:flex-col flex-row gap-2 px-4 py-5 sm:flex hidden">
        {props.items.map((i, idx) => (
          <li
            key={idx}
            className="relative p-2 flex items-center lg:justify-start justify-center"
          >
            {location.pathname === i.href && (
              <motion.div
                layoutId="underline"
                className={
                  'h-full w-full bg-slate-400 bg-opacity-10 absolute rounded-md'
                }
              ></motion.div>
            )}
            <Link
              as="navlink"
              to={i.href}
              className={` ${
                location.pathname === i.href
                  ? 'text-primary-500'
                  : 'text-opacity-60 text-gray-950'
              }
               no-underline relative flex px-2 gap-2 font-bold items-center`}
            >
              {i.Icon}
              <p className="m-0 lg:flex flex sm:hidden">{i.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationBar;
