import { Outlet } from 'react-router-dom';
import Header from './Header';
import ToolBar from './ToolBar';
import { useMatches } from '@remix-run/react';

function App() {
  const matches = useMatches();

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <Header />
      <div className="bg-primary-0 flex-grow px-4 py-2">
        <div className="flex items-center justify-between">
          <h1>
            {(matches.at(-1)?.data as Record<string, string | undefined> | null)
              ?.title ?? ''}
          </h1>
          <div className="hidden lg:block">
            <ToolBar />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
