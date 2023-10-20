import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  MapIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  WrenchIcon,
} from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import type { INavigationBarItem } from './types';

export default function Header() {
  const { t } = useTranslation('home');

  const itemsToolbar: INavigationBarItem[] = [
    {
      text: t('logout'),
      href: '/logout',
      Icon: (
        <ArrowLeftOnRectangleIcon className="w-4 h-4"></ArrowLeftOnRectangleIcon>
      ),
    },
  ];
  const itemsNav: INavigationBarItem[] = [
    {
      text: t('root.home'),
      href: '/',
      Icon: <Square2StackIcon className="w-4 h-4"></Square2StackIcon>,
    },
    {
      text: t('root.recruitment'),
      href: '/recuirment',
      Icon: <WrenchIcon className="w-4 h-4"></WrenchIcon>,
    },
    {
      text: t('root.department'),
      href: '/departments',
      Icon: <RectangleGroupIcon className="w-4 h-4"></RectangleGroupIcon>,
    },
    {
      text: t('root.absence'),
      href: '/absence',
      Icon: <MapIcon className="w-4 h-4"></MapIcon>,
    },
    {
      text: t('root.setting'),
      href: '/setting',
      Icon: <Cog6ToothIcon className="w-4 h-4"></Cog6ToothIcon>,
    },
  ];
  return (
    <header className="lg:min-h-screen border-solid border-primary-200 lg:border-r-2 lg:border-b-0 border-b-2">
      <NavigationBar
        navigationItems={itemsNav}
        toolBarItems={itemsToolbar}
      ></NavigationBar>
    </header>
  );
}
