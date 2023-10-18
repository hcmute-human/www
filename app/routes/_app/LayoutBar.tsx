import Logo from '@components/Logo';
import {
  MapIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  WrenchIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/20/solid';
import type { PropsNavgigateType } from './BarEntry';
import Bar from './Bar';
import { useTranslation } from 'react-i18next';

function LayoutHeader() {
  
  const {t} = useTranslation('home');
  
  const itemsToolbar: Array<PropsNavgigateType> = [
    {
      text: t('logout'),
      href: '/logout',
      Icon: <ArrowLeftOnRectangleIcon className="w-5 h-5"></ArrowLeftOnRectangleIcon>,
    },
    
  ];
  const itemsNav: Array<PropsNavgigateType> = [
    {
      text: t('root.home'),
      href: '/',
      Icon: <Square2StackIcon className="w-5 h-5"></Square2StackIcon>,
    },
    {
      text: t('root.recruitment'),
      href: '/recuirment',
      Icon: <WrenchIcon className="w-5 h-5"></WrenchIcon>,
    },
    {
      text: t('root.department'),
      href: '/departments',
      Icon: <RectangleGroupIcon className="w-5 h-5"></RectangleGroupIcon>,
    },
    {
      text: t('root.absence'),
      href: '/absence',
      Icon: <MapIcon className="w-5 h-5"></MapIcon>,
    },
    {
      text: t('root.setting'),
      href: '/setting',
      Icon: <Cog6ToothIcon className="w-5 h-5"></Cog6ToothIcon>,
    },
  ];
  return (
    <header className="lg:min-h-screen border-solid border-primary-200 lg:border-r-2 lg:border-b-0 border-b-2">
      <Bar itemsNav={itemsNav} itemToolbar={itemsToolbar}></Bar>
    </header>
  );
}

export default LayoutHeader;
