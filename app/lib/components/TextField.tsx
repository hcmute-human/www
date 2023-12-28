import { forwardRef, type ReactNode } from 'react';
import { type TextFieldProps } from 'react-aria-components';
import { useFormFieldsContext } from './Form';
import UncontrolledTextField from './UncontrolledTextField';

interface Props extends TextFieldProps {
  name: string;
  fieldName?: string;
  label?: ReactNode;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { defaultValue, errorMessage, fieldName, ...props }: Props,
  ref
) {
  const { [fieldName ?? props.name]: field } = useFormFieldsContext() ?? {};

  return (
    <UncontrolledTextField
      {...props}
      ref={ref}
      defaultValue={defaultValue ?? field.defaultValue}
      errorMessage={errorMessage ?? field?.error}
    />
  );
});

export default TextField;
