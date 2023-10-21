import { Outlet } from 'react-router-dom';
import Header from './Header';
import ToolBar from './ToolBar';
import { useMatches } from '@remix-run/react';
import Breadscumb from '@components/Breadcrumb';
import Link from '@components/Link';

export const handle = {
  breadcrumb: () => <Link href="/">Home</Link>,
};

function App() {
  const matches = useMatches();
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <Header />
      <div className="bg-primary-0 flex-grow px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="">
            <Breadscumb items={matches}></Breadscumb>
          </div>
          <div className="hidden lg:block">
            <ToolBar />
          </div>
        </div>
        <div className="h-[80vh]">
          <div className="items-center">
            <h1>
              {(
                matches.at(-1)?.data as unknown as Record<
                  string,
                  string | undefined
                > | null
              )?.title ?? ''}
            </h1>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
