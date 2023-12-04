import Link from '@components/Link';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { INavigationBarItem } from './types';

interface Props {
  isActive: boolean;
  item: INavigationBarItem;
  layoutId: string;
}

export default function NavigationBarItem({ isActive, item: { href, icon, text }, layoutId }: Props) {
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'relative block rounded-md px-3 py-1 transition-[font-weight] lg:px-4 lg:py-1 lg:min-w-[12rem]',
          isActive ? 'text-accent-500 font-bold duration-200' : 'hover:bg-primary-50'
        )}
      >
        {isActive ? (
          <motion.div
            layoutId={layoutId}
            transition={{
              type: 'tween',
              ease: 'anticipate',
              duration: '0.25',
            }}
            className="absolute inset-0 bg-accent-50 rounded-md"
          />
        ) : null}
        <div className="relative flex gap-4 items-center">
          {icon}
          <span className="hidden lg:inline">{text}</span>
        </div>
      </Link>
    </li>
  );
}
