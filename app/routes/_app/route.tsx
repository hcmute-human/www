import { Outlet } from 'react-router-dom';
import LayoutBar from './LayoutBar';
import ToolBar from './ToolBar';


export function handle() {
  return { i18n: 'home' };
}
function App() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <LayoutBar />
      <div className="bg-primary-0 flex-grow">
        <div className='lg:inline-block w-full hidden'>
          <ToolBar />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
