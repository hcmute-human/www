import { cn } from '@lib/utils';
import { forwardRef } from 'react';
import { Input as AriaInput, type InputProps } from 'react-aria-components';

const baseClass =
  'border border-neutral-300 bg-neutral-50 px-2 py-0.5 rounded transition-[background-color_outline] ease-in-out';

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props }: InputProps,
  ref
) {
  return (
    <AriaInput
      ref={ref}
      {...props}
      className={cn(baseClass, className)}
    ></AriaInput>
  );
});

export default Input;
