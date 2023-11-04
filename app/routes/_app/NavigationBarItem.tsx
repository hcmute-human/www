import Link from '@components/Link';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { INavigationBarItem } from './types';

interface Props {
  isActive: boolean;
  item: INavigationBarItem;
}

export default function NavigationBarItem({
  isActive,
  item: { href, icon, text },
}: Props) {
  return (
    <li>
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
              duration: '0.3',
            }}
            className="absolute inset-0 bg-accent-500 rounded-md"
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
