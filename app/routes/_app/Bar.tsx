import type { NavigationBarProps, PropsNavgigateType } from './BarEntry';
import { AnimatePresence } from 'framer-motion';
import NavigationEntry from './BarEntry';
import Logo from '@components/Logo';
import MenuDropBar from './MenuDropBar';
import ToolBar from './ToolBar';

type Props = {
  itemsNav: NavigationBarProps;
  itemToolbar: NavigationBarProps;
};
export default function Bar({ itemsNav, itemToolbar }: Props) {
  return (
    <AnimatePresence>
      <nav className="flex lg:flex-col items-center justify-between w-full h-full lg:py-8 sm:mx-5 lg:m-0">
        <div className="sm:flex flex lg:flex-col gap-6 w-full items-center">
          <Logo className="h-6 lg:mr-16"></Logo>
          <NavigationEntry items={itemsNav} />
          <div className="sm:hidden block my-2">
            <MenuDropBar items={itemsNav}></MenuDropBar>
          </div>
        </div>
        <div className="lg:mb-3 flex lg:flex-col items-center gap-4">
          <NavigationEntry items={itemToolbar} />
          <ToolBar></ToolBar>
        </div>
      </nav>
    </AnimatePresence>
  );
}
