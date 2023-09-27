import Logo from '@components/Logo';
import NavigationBar, { propsNavgigate } from '@components/NavigationBar';
import Rowdivider from '@components/Rowdivider';
import {
	MapIcon,
	RectangleGroupIcon,
	Square2StackIcon,
	WrenchIcon,
} from '@heroicons/react/20/solid';

const items: Array<propsNavgigate> = [
	{
		text: 'Home',
		href: '/',
		Icon: <Square2StackIcon className="h-5 w-5"></Square2StackIcon>,
	},
	{
		text: 'Recruitment',
		href: '/recuirment',
		Icon: <WrenchIcon className="h-5 w-5"></WrenchIcon>,
	},
	{
		text: 'Department',
		href: '/department',
		Icon: <RectangleGroupIcon className="h-5 w-5"></RectangleGroupIcon>,
	},
	{
		text: 'Absence',
		href: '/absence',
		Icon: <MapIcon className="h-5 w-5"></MapIcon>,
	},
];
function LayoutHeader() {
	return (
		<header className="lg:h-screen lg:max-w-[13rem] lg:w-full flex lg:flex-col border-solid lg:border-r-[2px] border-b-[2px]">
			<div className="flex lg:flex-col items-center gap-6 w-full">
				<Logo className="h-6"></Logo>
				<NavigationBar items={items}></NavigationBar>
			</div>
		</header>
	);
}

export default LayoutHeader;
