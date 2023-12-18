import Button from '@components/Button';
import Logo from '@components/Logo';
import ThemeSwitch from '@components/ThemeSwitch';
import { CalendarIcon, HomeIcon, Square2StackIcon, UsersIcon } from '@heroicons/react/20/solid';
import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import type { INavigationBarItem } from './types';

export default function Header() {
  const { t } = useTranslation('home');
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
    {
      text: t('navigation.leave'),
      href: '/leaves',
      icon: <CalendarIcon className="w-5" />,
    },
  ];

  return (
    <header className="flex gap-4 items-center p-4 border-r border-primary-100 lg:flex-col">
      <Logo className="w-24 lg:self-start lg:ml-4" />
      <div className="flex-grow flex justify-between items-center gap-2 lg:grid lg:content-between">
        <NavigationBar items={navigationItems} />
        <ul className="flex items-center gap-2 flex-nowrap lg:block lg:space-y-2">
          <li className="whitespace-nowrap lg:px-4 lg:mb-2">
            <ThemeSwitch />
          </li>
          <li>
            <Form action="/logout" method="post">
              <Button type="submit" variant="primary" outlined className="w-full">
                {t('logout')}
              </Button>
            </Form>
          </li>
        </ul>
      </div>
    </header>
  );
}
