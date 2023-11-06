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
          'rac-placement-bottom:mt-2 rac-placement-top:mb-2 group rounded-lg drop-shadow-lg border border-primary-200 bg-primary-0',
          isEntering &&
            `rac-placement-bottom:animate-duration-200 rac-placement-bottom:animate-ease-in-out
          rac-placement-top:animate-duration-200 rac-placement-top:animate-ease-in-out
          rac-placement-bottom:animate-fadeInDownBig rac-placement-bottom:animate-distance-2
          rac-placement-top:animate-fadeInUpBig rac-placement-top:animate-distance-2`,
          isExiting &&
            `rac-placement-bottom:animate-duration-200 rac-placement-bottom:animate-ease-in-out
          rac-placement-top:animate-duration-200 rac-placement-top:animate-ease-in-out
          rac-placement-bottom:animate-fadeOutUpBig rac-placement-bottom:animate-distance-2
          rac-placement-top:animate-fadeOutDownBig rac-placement-top:animate-distance-2`
        )
      }
    >
      <OverlayArrow>
        <svg
          viewBox="0 0 12 12"
          className="block fill-primary-0 stroke-primary-200 group-rac-placement-bottom:rotate-180 w-4 h-4"
          stroke="1"
        >
          <path d="M0 0L6 6L12 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaPopover>
  );
}
