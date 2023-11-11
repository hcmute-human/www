import clsx from 'clsx';
import type { ReactNode } from 'react';
import {
  Popover as AriaPopover,
  OverlayArrow,
  type PopoverProps,
} from 'react-aria-components';

interface Props extends Omit<PopoverProps, 'children'> {
  children: ReactNode;
}

export default function Popover({ children, ...props }: Props) {
  return (
    <AriaPopover
      {...props}
      className={({ isEntering, isExiting }) =>
        clsx(
          'placement-bottom:mt-2 placement-top:mb-2 group rounded-lg drop-shadow-lg border border-primary-200 bg-primary-0',
          isEntering &&
            `placement-bottom:animate-duration-200 placement-bottom:animate-ease-in-out
          placement-top:animate-duration-200 placement-top:animate-ease-in-out
          placement-bottom:animate-fadeInDownBig placement-bottom:animate-distance-2
          placement-top:animate-fadeInUpBig placement-top:animate-distance-2`,
          isExiting &&
            `placement-bottom:animate-duration-200 placement-bottom:animate-ease-in-out
          placement-top:animate-duration-200 placement-top:animate-ease-in-out
          placement-bottom:animate-fadeOutUpBig placement-bottom:animate-distance-2
          placement-top:animate-fadeOutDownBig placement-top:animate-distance-2`
        )
      }
    >
      <OverlayArrow>
        <svg
          viewBox="0 0 12 12"
          className="block fill-primary-0 stroke-primary-200 group-placement-bottom:rotate-180 w-4 h-4"
          stroke="1"
        >
          <path d="M0 0L6 6L12 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaPopover>
  );
}
