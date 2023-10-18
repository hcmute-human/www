import type { NavigationBarProps, PropsNavgigateType } from './BarEntry';
import { AnimatePresence } from 'framer-motion';
import NavigationEntry from './BarEntry';
import Logo from '@components/Logo';
import MenuDropBar from './MenuDropBar';
import ToolBar from './ToolBar';
import Switch from '@components/Switch';

type Props = {
  itemsNav: NavigationBarProps;
  itemToolbar: NavigationBarProps;
};
export default function Bar({ itemsNav, itemToolbar }: Props) {
  return (
    <AnimatePresence>
      <nav className="flex lg:flex-col items-center justify-between gap-8 w-full h-full px-4 py-2 lg:px-0">
        <div className="flex lg:flex-col gap-4 w-full items-center px-4">
          <Logo className="w-20 lg:self-start" />
          <div className="sm:block hidden">
            <NavigationEntry items={itemsNav} />
          </div>
          <div className="sm:hidden">
            <MenuDropBar items={itemsNav}></MenuDropBar>
          </div>
        </div>
        <div className="lg:mb-3 flex lg:flex-col items-center gap-4">
          <div className='lg:block hidden'>
            <NavigationEntry items={itemToolbar} />
          </div>
          <div className='lg:hidden block'>
            <ToolBar></ToolBar>
          </div>
        </div>
      </nav>
    </AnimatePresence>
  );
}
