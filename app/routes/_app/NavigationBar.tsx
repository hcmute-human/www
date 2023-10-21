import Logo from '@components/Logo';
import ThemeSwitch from '@components/ThemeSwitch';
import { AnimatePresence } from 'framer-motion';
import MenuDropBar from './MenuDropBar';
import NavigationBarItems from './NavigationBarItems';
import ToolBar from './ToolBar';
import type { INavigationBarItem } from './types';

type Props = {
  navigationItems: INavigationBarItem[];
  toolBarItems: INavigationBarItem[];
};

export default function NavigationBar({
  navigationItems,
  toolBarItems,
}: Props) {
  return (
    <AnimatePresence>
      <nav className="flex lg:flex-col items-center justify-between gap-8 w-full h-full px-4 py-2 lg:px-0">
        <div className="flex lg:flex-col gap-4 w-full items-center px-4">
          <Logo className="w-20 lg:self-start lg:mt-3 lg:ml-3" />
          <div className="sm:block hidden">
            <NavigationBarItems items={navigationItems} />
          </div>
          <div className="sm:hidden">
            <MenuDropBar items={navigationItems}></MenuDropBar>
          </div>
        </div>
        <div className="lg:mb-3 flex lg:flex-col items-center gap-4">
          <div className="lg:block hidden">
            <NavigationBarItems items={toolBarItems} />
          </div>
          <div className="text-left mr-3 lg:block hidden">
            <ThemeSwitch></ThemeSwitch>
          </div>
          <div className="lg:hidden block">
            <ToolBar></ToolBar>
          </div>
        </div>
      </nav>
    </AnimatePresence>
  );
}
