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

  const toolBarItems: INavigationBarItem[] = [
    {
      text: t('logout'),
      href: '/logout',
      icon: <ArrowLeftOnRectangleIcon className="w-5 h-5" />,
    },
  ];
  const navigationItems: INavigationBarItem[] = [
    {
      text: t('bar.home'),
      href: '/',
      icon: <Square2StackIcon className="w-5 h-5" />,
    },
    {
      text: t('bar.recruitment'),
      href: '/recuirment',
      icon: <WrenchIcon className="w-5 h-5" />,
    },
    {
      text: t('bar.department'),
      href: '/departments',
      icon: <RectangleGroupIcon className="w-5 h-5" />,
    },
    {
      text: t('bar.absence'),
      href: '/absence',
      icon: <MapIcon className="w-5 h-5" />,
    },
    {
      text: t('bar.setting'),
      href: '/setting',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
  ];
  return (
    <header className="lg:min-h-screen border-solid border-primary-200 lg:border-r-2 lg:border-b-0 border-b-2">
      <NavigationBar
        navigationItems={navigationItems}
        toolBarItems={toolBarItems}
      />
    </header>
  );
}
