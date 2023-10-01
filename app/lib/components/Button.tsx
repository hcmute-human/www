import { cn } from '@lib/utils';
import { Button as AriaButton, type ButtonProps } from 'react-aria-components';

interface Props extends ButtonProps {
  variant?: 'accent' | 'primary';
}

const baseClass =
  'px-4 py-0.5 rounded-lg transition-[background-color_outline] ease-in-out';

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  accent: 'bg-accent-500 text-neutral-100 rac-hover:bg-accent-600',
  primary: 'bg-neutral-900 text-neutral-100',
};

const disabledClass =
  'rac-disabled:bg-neutral-300 rac-disabled:text-neutral-500';

export default function Button({
  className,
  isDisabled,
  variant = 'accent',
  ...props
}: Props) {
  return (
    <AriaButton
      {...props}
      className={cn(baseClass, variantClass[variant], disabledClass, className)}
      isDisabled={isDisabled}
    />
  );
}
