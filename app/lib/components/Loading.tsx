import clsx from 'clsx';
import type { ReactNode } from 'react';
import ProgressCircle from './ProgressCircle';
import { Transition } from '@headlessui/react';

interface Props {
  loading: boolean;
  children: ReactNode;
}

export default function Loading({ loading, children }: Props) {
  return (
    <div className="relative">
      <div
        className={clsx('block transition ease-in-out', {
          'opacity-0 scale-0': loading,
        })}
      >
        {children}
      </div>
      <Transition
        show={loading}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        enter="transition ease-in-out"
        enterFrom="opacity-0 scale-0"
        leave="transition ease-in-out duration-300"
        leaveTo="opacity-0 scale-0"
      >
        <ProgressCircle
          isIndeterminate
          className="w-full h-full text-primary-50"
          aria-label="Loading"
        />
      </Transition>
    </div>
  );
}
