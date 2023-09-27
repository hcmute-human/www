import { Breadcrumb, Breadcrumbs } from 'react-aria-components';
import Navlink from './Navlink';
import { useEffect, useState } from 'react';

export type propsNavgigate = {
	text: string;
	href: string;
	Icon: any;
};
type NavigationBarProps = {
	items: Array<propsNavgigate>;
};

const NavigationBar = (props: NavigationBarProps) => {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			setIsDropdownVisible(window.innerWidth <= 768);
			console.log(isDropdownVisible);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className="relative sm:py-0 py-4 sm:px-4">
			<button
				onClick={() => setIsDropdownVisible(!isDropdownVisible)}
				className="block md:hidden text-xs"
			>
				Menu
			</button>
			<Breadcrumbs
				className={`md:flex lg:flex-col lg:w-full md:w-fit m-0 gap-2 sm:p-0 px-3 py-3 ${
					isDropdownVisible
						? 'absolute z-30 bg-white shadow-sm rounded-md'
						: 'hidden md:flex'
				} justify-center`}
			>
				{props.items.map((i, idx) => (
					<Breadcrumb key={idx} className="w-full sm:px-4">
						<Navlink
							{...i}
							className="w-full font-medium lg:py-2 sm:py-4 sm:pl-1 lg:pl-4 py-2"
						></Navlink>
					</Breadcrumb>
				))}
			</Breadcrumbs>
		</div>
	);
};

export default NavigationBar;
