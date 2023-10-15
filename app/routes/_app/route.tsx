import { Outlet } from 'react-router-dom';
import LayoutHeader from './LayoutHeader';

function App() {
  return (
    <div className="flex lg:flex-row flex-col">
      <LayoutHeader />
      <Outlet />
    </div>
  );
}

export default App;
