import { cn } from '@lib/utils';
import type { ReactNode } from 'react';
import { Switch as AriaSwitch, type SwitchProps } from 'react-aria-components';

interface Props extends Omit<SwitchProps, 'children'> {
  children: ReactNode;
  trackClass?: string;
  indicatorClass?: string;
}

const trackBaseClass =
  'relative w-12 h-6 border-2 border-primary-300 bg-primary-50 rounded-full transition-[background-color_outline] group-focus-visible:outline-focus';
const indicatorBaseClass =
  'block transition-[left_background-color_transform] duration-300 ease-in-out absolute h-4 aspect-square rounded-full bg-accent-500 top-1/2 -translate-y-1/2 left-1 group-selected:left-[calc(100%-0.25rem)] group-selected:-translate-x-full';

export default function Switch({
  children,
  className,
  trackClass,
  indicatorClass,
  ...props
}: Props) {
  return (
    <AriaSwitch
      {...props}
      className={cn(
        'flex group gap-4 focus:outline-none items-center',
        className
      )}
    >
      {children}
      <div className={cn(trackBaseClass, trackClass)}>
        <span className={cn(indicatorBaseClass, indicatorClass)} />
      </div>
    </AriaSwitch>
  );
}
