import Logo from '@components/Logo';
import ThemeSwitch from '@components/ThemeSwitch';
import { ArrowLeftOnRectangleIcon, HomeIcon, Square2StackIcon, UsersIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import type { INavigationBarItem } from './types';

export default function Header() {
  const { t } = useTranslation('home');
  const toolBarItems: INavigationBarItem[] = [
    {
      text: t('logout'),
      href: '/logout',
      icon: <ArrowLeftOnRectangleIcon className="w-4" />,
    },
  ];
  const navigationItems: INavigationBarItem[] = [
    {
      text: t('navigation.home'),
      href: '/',
      icon: <HomeIcon className="w-5" />,
    },
    {
      text: t('navigation.department'),
      href: '/departments',
      icon: <Square2StackIcon className="w-5" />,
    },
    {
      text: t('navigation.employee'),
      href: '/employees',
      icon: <UsersIcon className="w-5" />,
    },
  ];

  return (
    <header className="flex gap-4 items-center p-4 border-r border-primary-100 lg:flex-col">
      <Logo className="w-24 lg:self-start lg:ml-4" />
      <div className="flex-grow flex justify-between items-center gap-1 lg:grid lg:content-between">
        <NavigationBar items={navigationItems} />
        <div className="flex gap-1 items-center flex-nowrap lg:block">
          <NavigationBar items={toolBarItems} />
          <div className="whitespace-nowrap lg:px-4 lg:mt-1">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
