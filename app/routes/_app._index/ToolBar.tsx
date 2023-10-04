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
    <div className="w-full lg:gap-5 lg:flex-col flex-row flex">
      <ul className=" gap-2 lg:px-4 py-5 lg:flex-col flex flex-row">
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
                no-underline relative px-2 gap-2 font-bold items-center flex
                ${item.text === 'Notification' && 'lg:hidden flex'}`}
              >
                {item.Icon}
                <p
                  className={` ${
                    // item.text === 'Notification' &&
                    'lg:flex hidden'
                  }`}
                >
                  {item.text}
                </p>
              </Link>
            ) : (
              <div className="text-opacity-60 text-gray-950 no-underline relative px-2 gap-2 font-bold items-center lg:flex hidden">
                {item.Icon}
                <p className="m-0">{item.text}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex gap-3 items-center lg:px-8 pr-7 py-5">
        <div className="w-7 aspect-square bg-gray-500 rounded-full"></div>
        <p className="font-bold text-gray-500 text-xs lg:flex hidden">
          Qanh@gmai.com
        </p>
      </div>
    </div>
  );
}
