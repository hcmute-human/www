import { cn } from '@lib/utils';
import { Link as AriaLink, type LinkProps } from 'react-aria-components';

type Props = LinkProps;

const baseClass = 'text-accent-500 underline underline-offset-2';

export default function Link({ className, ...props }: Props) {
  return (
    <AriaLink className={cn(baseClass, className)} target="_self" {...props} />
  );
}
