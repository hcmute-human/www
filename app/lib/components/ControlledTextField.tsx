import type { TextFieldProps } from 'react-aria-components';
import {
  type UseControllerProps,
  Controller,
  useFormContext,
} from 'react-hook-form';
import TextField from './TextField';

interface Props extends TextFieldProps {
  name: string;
  rules?: UseControllerProps['rules'];
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export default function ControlledTextField({
  errorMessage,
  rules,
  ...props
}: Props) {
  const methods = useFormContext();
  errorMessage ??= methods.formState.errors[props.name]?.message?.toString();
  return (
    <Controller
      rules={rules}
      name={props.name}
      control={methods.control}
      render={({ field }) => (
        <TextField {...props} {...field} errorMessage={errorMessage} />
      )}
    />
  );
}
