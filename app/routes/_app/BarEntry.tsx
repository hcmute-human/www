import Link from '@components/Link';
import MyTooltip from '@components/Tooltip';
import { useLocation } from '@remix-run/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
export type PropsNavgigateType = {
  text: string;
  href: string;
  Icon: any;
};
import { TooltipTrigger } from 'react-aria-components';

export type NavigationBarProps = Array<PropsNavgigateType>;
const NavigationEntry = ({ items }: { items: NavigationBarProps }) => {
  const location = useLocation();
  return (
    <ul className={`flex lg:flex-col gap-2 justify-center`}>
      {items.map((i, idx) => (
        <li key={idx} className="lg:w-[24ch] relative">
          {location.pathname === i.href && (
            <motion.div
              layoutId="underline"
              className="absolute -z-30 bg-primary-100 w-full h-full rounded-md"
            />
          )}
          <TooltipTrigger delay={200}>
            <Link
              href={i.href}
              className={clsx(
                'no-underline flex items-center w-full text-primary-900 sm:py-2 gap-2 rounded-md lg:px-4 px-2',
                { 'text-accent-500': location.pathname === i.href }
              )}
            >
              <MyTooltip className="lg:hidden inline-block rounded bg-primary-100 px-4 py-1 mt-2">
                {i.text}
              </MyTooltip>
              {i.Icon}
              <p className="lg:block hidden">{i.text}</p>
            </Link>
          </TooltipTrigger>
        </li>
      ))}
    </ul>
  );
};

export default NavigationEntry;
