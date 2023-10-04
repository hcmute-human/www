import Logo from '@components/Logo';
import NavigationBar, {
  type PropsItemNavgigate,
} from '~/routes/_app._index/NavigationBar';
import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  MapIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  WrenchIcon,
} from '@heroicons/react/20/solid';
import ToolBar, { type PropsItemToolbar } from './ToolBar';

const itemsnavigate: Array<PropsItemNavgigate> = [
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
const itemstoolbar: Array<PropsItemToolbar> = [
  {
    text: 'Notification',
    href: '/notification',
    Icon: <BellIcon className="h-5 w-5"></BellIcon>,
  },
  {
    text: 'Setting',
    href: '/setting',
    Icon: <Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>,
  },
  {
    text: 'Logout',
    Icon: (
      <ArrowLeftOnRectangleIcon className="h-5 w-5"></ArrowLeftOnRectangleIcon>
    ),
  },
];
function LayoutHeader() {
  return (
    <header className="lg:h-screen lg:max-w-[13rem] lg:w-full flex justify-between lg:flex-col border-solid lg:border-r-[2px] border-b-[2px]">
      <div className="flex lg:flex-col items-center gap-3 w-full">
        <Logo className="h-6 mt-7"></Logo>
        <NavigationBar items={itemsnavigate}></NavigationBar>
      </div>
      <div className="">
        <ToolBar items={itemstoolbar}></ToolBar>
      </div>
    </header>
  );
}

export default LayoutHeader;
