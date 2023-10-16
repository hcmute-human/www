import { Outlet } from 'react-router-dom';
import LayoutHeader from './LayoutHeader';

function App() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <LayoutHeader />
      <div className="bg-primary-0 flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
