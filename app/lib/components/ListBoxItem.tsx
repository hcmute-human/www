import clsx from 'clsx';
import {
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps,
} from 'react-aria-components';

interface Props<T extends object> extends ListBoxItemProps<T> {}

export default function ListBoxItem<T extends object>({
  className,
  ...props
}: Props<T>) {
  return (
    <AriaListBoxItem
      {...props}
      className={clsx('group c-listbox-item', className)}
    />
  );
}
