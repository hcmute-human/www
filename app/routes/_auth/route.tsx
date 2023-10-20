import { AnimatedOutlet } from '@components/AnimatedOutlet';
import MeshGradient from '@components/MeshGradient';
import { useLocation } from '@remix-run/react';
import clsx from 'clsx';
import { SwitchTransition } from 'transition-hook';

export default function Route() {
  const { pathname } = useLocation();
  return (
    <>
      <MeshGradient className="fixed w-screen h-screen opacity-5 bg-accent-500" />
      <div className="relative min-h-screen min-w-screen flex justify-center py-[20vh]">
        <SwitchTransition state={pathname} timeout={100} mode="out-in">
          {(_, stage) => (
            <div
              className={clsx(
                'transition-opacity duration-100',
                {
                  from: 'opacity-0 ease-in',
                  enter: '',
                  leave: 'opacity-0 ease-out',
                }[stage]
              )}
            >
              <AnimatedOutlet />
            </div>
          )}
        </SwitchTransition>
      </div>
    </>
  );
}
