import Logo from '@components/Logo';
import {
  MapIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  WrenchIcon,
  Cog6ToothIcon,
  BellIcon,
} from '@heroicons/react/20/solid';
import type { PropsNavgigateType } from './BarEntry';
import Bar from './Bar';

const itemsToolbar: Array<PropsNavgigateType> = [
  {
    text: 'Notification',
    href: '/notification',
    Icon: <BellIcon className="w-5 h-5"></BellIcon>,
  },
  {
    text: 'Setting',
    href: '/setting',
    Icon: <Cog6ToothIcon className="w-5 h-5"></Cog6ToothIcon>,
  },
];
const itemsNav: Array<PropsNavgigateType> = [
  {
    text: 'Home',
    href: '/',
    Icon: <Square2StackIcon className="w-5 h-5"></Square2StackIcon>,
  },
  {
    text: 'Recruitment',
    href: '/recuirment',
    Icon: <WrenchIcon className="w-5 h-5"></WrenchIcon>,
  },
  {
    text: 'Department',
    href: '/departments',
    Icon: <RectangleGroupIcon className="w-5 h-5"></RectangleGroupIcon>,
  },
  {
    text: 'Absence',
    href: '/absence',
    Icon: <MapIcon className="w-5 h-5"></MapIcon>,
  },
];
function LayoutHeader() {
  return (
    <header className="lg:min-h-screen border-solid border-primary-200 lg:border-r-2 lg:border-b-0 border-b-2">
      <Bar itemsNav={itemsNav} itemToolbar={itemsToolbar}></Bar>
    </header>
  );
}

export default LayoutHeader;
