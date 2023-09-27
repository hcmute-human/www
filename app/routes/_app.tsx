import Footer from '@components/Footer';
import Rowdivider from '@components/Rowdivider';
import LayoutHeader from '@components/layouts/LayoutHeader';
import NavigationBar from '@lib/components/NavigationBar';
import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
	return (
		<div className="flex lg:flex-row flex-col">
			<div className="">
				<LayoutHeader></LayoutHeader>
			</div>
			<Outlet></Outlet>
			<div>
				<Footer></Footer>
			</div>
		</div>
	);
}

export default App;
