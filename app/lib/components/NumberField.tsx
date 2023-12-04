import { forwardRef } from 'react';
import { type NumberFieldProps } from 'react-aria-components';
import { useFormFieldsContext } from './Form';
import UncontrolledNumberField from './UncontrolledNumberField';

interface Props extends NumberFieldProps {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const NumberField = forwardRef<HTMLInputElement, Props>(function NumberField(
  { defaultValue, errorMessage, ...props }: Props,
  ref
) {
  const { [props.name]: field } = useFormFieldsContext() ?? {};

  return (
    <UncontrolledNumberField
      {...props}
      ref={ref}
      defaultValue={defaultValue ?? field.defaultValue}
      errorMessage={errorMessage ?? field?.error}
    />
  );
});

export default NumberField;
