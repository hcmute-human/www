import Link from '@components/Link';
import MyTooltip from '@components/Tooltip';
import { useLocation } from '@remix-run/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { TooltipTrigger } from 'react-aria-components';
import type { INavigationBarItem } from './types';

export default function NavigationBarItems({
  items,
}: {
  items: INavigationBarItem[];
}) {
  const { pathname } = useLocation();
  return (
    <ul className={`flex lg:flex-col gap-2 justify-center`}>
      {items.map((i, idx) => (
        <li key={idx} className="lg:w-[24ch] relative">
          {pathname === i.href && (
            <motion.div
              layoutId="underline"
              className="absolute -z-30 bg-primary-100 w-full h-full rounded-lg"
            />
          )}
          <TooltipTrigger delay={200}>
            <Link
              href={i.href}
              className={clsx(
                'no-underline flex items-center w-full text-primary-900 sm:py-2 gap-2 rounded-md lg:px-4 px-2',
                { 'text-accent-500': pathname === i.href }
              )}
            >
              <MyTooltip className="lg:hidden inline-block rounded bg-primary-100 px-4 py-1 mt-2">
                {i.text}
              </MyTooltip>
              {i.icon}
              <p className="lg:block hidden ml-1">{i.text}</p>
            </Link>
          </TooltipTrigger>
        </li>
      ))}
    </ul>
  );
}
