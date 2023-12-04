import { cn } from '@lib/utils';
import { Tabs as AriaTabs, Tab, TabList, type TabsProps } from 'react-aria-components';

interface TabItem {
  id: string;
  href: string;
  label: string;
}

interface Props extends TabsProps {
  items: TabItem[];
}

export default function Tabs({ items, className, ...props }: Props) {
  return (
    <AriaTabs {...props} className={cn('outline-none', className)}>
      <TabList className="flex gap-2 items-center" items={items}>
        {({ id, href, label }) => (
          <Tab id={id} href={href} className="group outline-none focus-visible:outline-focus rounded">
            <div className="relative h-full px-4 py-2">
              <span className="absolute inset-x-0 transition-[height_background-color_transform] ease-in-out h-0.5 scale-x-0 -translate-x-1/2 group-hover:translate-x-0 group-selected:translate-x-0 group-hover:scale-x-100 group-selected:scale-x-100 bottom-0 bg-primary-400 group-selected:bg-accent-500" />
              <span className="relative transition-[color_font-weight] ease-in-out group-selected:text-accent-500 group-selected:font-bold group-hover:text-primary-400">
                {label}
              </span>
            </div>
          </Tab>
        )}
      </TabList>
    </AriaTabs>
  );
}
