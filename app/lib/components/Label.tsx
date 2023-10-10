import { cn } from '@lib/utils';
import { Label as AriaLabel, type LabelProps } from 'react-aria-components';

const baseClass = 'text-sm text-primary-700';

export default function Label({ className, children, ...props }: LabelProps) {
  return (
    <AriaLabel {...props} className={cn(baseClass, className)}>
      {children}
    </AriaLabel>
  );
}
