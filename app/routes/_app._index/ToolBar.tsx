import Link from '@components/Link';
import { useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';

export interface PropsItemToolbar {
  text: string;
  href?: string;
  Icon: any;
}
type ToolBarProps = {
  items: Array<PropsItemToolbar>;
};
export default function ToolBar({ items }: ToolBarProps) {
  const location = useLocation();
  return (
    <div className="w-full gap-5 items-center">
      <div className="flex gap-3 items-center px-8 py-7">
        <div className="w-7 aspect-square bg-gray-500 rounded-full"></div>
        <p className="font-bold text-gray-500">User</p>
      </div>
      <ul className=" lg:flex-col flex-row gap-2 px-4 py-5 sm:flex hidden">
        {items.map(({ ...item }, idx) => (
          <li
            key={idx}
            className="relative p-2 flex items-center lg:justify-start justify-center"
          >
            {location.pathname === item.href && (
              <motion.div
                layoutId="underline"
                className={
                  'h-full w-full bg-slate-400 bg-opacity-10 absolute rounded-md'
                }
              ></motion.div>
            )}
            {item.href !== undefined ? (
              <Link
                as="navlink"
                to={item?.href}
                className={` ${
                  location.pathname === item.href
                    ? 'text-primary-500'
                    : 'text-opacity-60 text-gray-950'
                }
                   no-underline relative flex px-2 gap-2 font-bold items-center`}
              >
                {item.Icon}
                <p className="m-0 lg:flex flex sm:hidden">{item.text}</p>
              </Link>
            ) : (
              <div className="text-opacity-60 text-gray-950 no-underline relative flex px-2 gap-2 font-bold items-center">
                {item.Icon}
                <p className="m-0 lg:flex flex sm:hidden">{item.text}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
