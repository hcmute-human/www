import Link from '@components/Link';
import MyTooltip from '@components/Tooltip';
import { useLocation } from '@remix-run/react';
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
    <div className="lg:px-2 sm:block hidden">
      <ul
        className={`sm:flex lg:flex-col gap-3 px-2 justify-center sm:my-2 lg:my-0`}
      >
        {items.map((i, idx) => (
          <li key={idx} className="lg:w-[160px] w-fit relative">
            {location.pathname.toString() === i.href && (
              <motion.div
                layoutId="underline"
                className="absolute -z-30 bg-slate-300 w-full h-full bg-opacity-30 rounded-md"
              />
            )}
            <TooltipTrigger delay={0}>
              <Link
                href={i.href}
                className={`no-underline flex items-center font-medium w-full text-gray-900 sm:py-2 gap-2 rounded-md px-2
              ${location.pathname.toString() === i.href && 'text-blue-600'}`}
              >
                <MyTooltip className="inline-block lg:hidden rounded bg-primary-500 px-4 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                  {i.text}
                </MyTooltip>
                {i.Icon}
                <p className="lg:block hidden">{i.text}</p>
              </Link>
            </TooltipTrigger>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationEntry;
