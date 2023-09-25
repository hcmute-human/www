import { cn } from '@lib/utils';
import { Button as AriaButton, type ButtonProps } from 'react-aria-components';

const baseClass =
	'bg-primary-500 px-4 py-0.5 rounded-lg text-neutral-100 transition-[background-color_outline] ease-in-out rac-hover:bg-primary-600 rac-disabled:bg-neutral-300 rac-disabled:text-neutral-500';

export default function Button({ className, ...props }: ButtonProps) {
	return <AriaButton {...props} className={cn(baseClass, className)} />;
}
