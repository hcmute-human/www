import { Outlet } from '@remix-run/react';
import LayoutHeader from './_app._index/LayoutHeader';

function App() {
  return (
    <div className="flex lg:flex-row flex-col">
      <div className="">
        <LayoutHeader></LayoutHeader>
      </div>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
