import Link from '@components/Link';
import { useLocation } from '@remix-run/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { TooltipTrigger } from 'react-aria-components';
import type { INavigationBarItem } from './types';

export default function NavigationBarItem({
  item: { href, icon, text },
}: {
  item: INavigationBarItem;
}) {
  const { pathname } = useLocation();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        'relative block rounded-md px-3 py-1 transition-[color_font-weight] ease-in-out lg:px-4 lg:py-2',
        {
          'text-primary-50 font-bold duration-200': isActive,
          'hover:text-accent-500': !isActive,
        }
      )}
    >
      {isActive ? (
        <motion.div
          key={href}
          layoutId="highlight"
          transition={{
            type: 'tween',
            ease: 'anticipate',
            duration: '0.4',
          }}
          className="absolute inset-0 bg-accent-500 rounded-md"
        />
      ) : null}
      <div className="relative flex gap-4 items-center">
        {icon}
        <span className="hidden lg:inline">{text}</span>
      </div>
    </Link>
  );
}
