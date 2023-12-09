import { useFormFieldsContext } from './Form';
import type { UncontrolledSelectFieldProps } from './UncontrolledSelectField';
import UncontrolledSelectField from './UncontrolledSelectField';

interface SelectFieldProps<T extends object> extends UncontrolledSelectFieldProps<T> {}

export default function SelectField<T extends object>({ errorMessage, ...props }: SelectFieldProps<T>) {
  const { [props.name]: field } = useFormFieldsContext() ?? {};

  return (
    <UncontrolledSelectField
      {...props}
      defaultSelectedKey={field.defaultValue}
      errorMessage={errorMessage ?? field?.error}
    />
  );
}
