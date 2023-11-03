import clsx from 'clsx';
import { forwardRef } from 'react';
import { Input as AriaInput, type InputProps } from 'react-aria-components';

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props }: InputProps,
  ref
) {
  return (
    <AriaInput ref={ref} {...props} className={clsx('c-input', className)} />
  );
});

export default Input;
