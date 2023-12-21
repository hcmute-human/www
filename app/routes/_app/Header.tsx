import Button from '@components/Button';
import Logo from '@components/Logo';
import ThemeSwitch from '@components/ThemeSwitch';
import {
  CalendarIcon,
  HomeIcon,
  MoonIcon,
  Square2StackIcon,
  SunIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/20/solid';
import { Form, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import type { INavigationBarItem } from './types';
import { useSetTheme, useTheme } from '@lib/contexts/theme.context';
import { useId } from 'react';

export default function Header() {
  const { t } = useTranslation('home');
  const { id } = useLoaderData<any>();
  const theme = useTheme();
  const setTheme = useSetTheme();
  const navigationItems: INavigationBarItem[] = [
    {
      text: t('navigation.home'),
      href: '/home',
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

  const bottomItems: INavigationBarItem[] = [
    {
      text: t('navigation.profile'),
      href: `/profiles/${id}`,
      icon: <UserCircleIcon className="w-5" />,
    },
  ];

  const layoutId = useId();

  return (
    <header className="flex gap-4 items-center p-4 border-r border-primary-100 lg:flex-col">
      <Logo className="w-24 lg:self-start lg:ml-4" />
      <div className="flex-grow flex justify-between items-center gap-2 lg:grid lg:content-between">
        <NavigationBar items={navigationItems} layoutId={layoutId} />
        <div className="flex flex-nowrap items-center gap-1 lg:block">
          <NavigationBar items={bottomItems} layoutId={layoutId} />
          <div className="flex items-center gap-1 lg:block lg:space-y-1 lg:mt-2">
            <div className="mx-auto w-fit whitespace-nowrap lg:px-4 lg:mb-2 hidden lg:block">
              <ThemeSwitch className="w-fit" />
            </div>
            <Button
              type="button"
              variant="primary"
              className="px-3 py-1 bg-transparent text-primary-900 lg:hidden hover:bg-primary-50"
              onPress={() => {
                setTheme((x) => (x === 'dark' ? 'light' : 'dark'));
              }}
            >
              {theme === 'dark' ? <MoonIcon className="w-5" /> : <SunIcon className="w-5" />}
            </Button>
            <Form action="/logout" method="post">
              <Button type="submit" variant="primary" outlined className="w-full">
                {t('logout')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </header>
  );
}
