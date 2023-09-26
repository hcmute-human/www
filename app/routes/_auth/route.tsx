import MeshGradient from '@components/MeshGradient';
import { Outlet } from '@remix-run/react';

export default function Route() {
  return (
    <>
      <MeshGradient className="fixed w-screen h-screen opacity-5 bg-primary-500" />
      <div className="relative min-h-screen min-w-screen flex justify-center py-[20vh]">
        <Outlet />
      </div>
    </>
  );
}
