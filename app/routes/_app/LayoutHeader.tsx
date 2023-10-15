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
    Icon: <BellIcon className="h-5 w-5"></BellIcon>,
  },
  {
    text: 'Setting',
    href: '/setting',
    Icon: <Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>,
  },
];
const itemsNav: Array<PropsNavgigateType> = [
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
    <header className="lg:h-screen  lg:w-fit flex lg:flex-col border-solid lg:border-r-[2px] border-b-[2px]">
      <Bar itemsNav={itemsNav} itemToolbar={itemsToolbar}></Bar>
    </header>
  );
}

export default LayoutHeader;
