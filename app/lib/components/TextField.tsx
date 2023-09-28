import { cn } from '@lib/utils';
import { forwardRef } from 'react';
import {
  TextField as AriaTextField,
  Text,
  type TextFieldProps,
} from 'react-aria-components';
import { Controller, type UseControllerProps } from 'react-hook-form';
import Input from './Input';
import Label from './Label';

interface InternalProps extends TextFieldProps {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

interface Props extends InternalProps {
  rules?: UseControllerProps['rules'];
}

const InternalTextField = forwardRef<HTMLInputElement, InternalProps>(
  function InternalTextField(
    {
      label,
      labelClassName,
      inputClassName,
      description,
      errorMessage,
      ...props
    }: Props,
    ref
  ) {
    const invalid = errorMessage != null;
    return (
      <AriaTextField {...props} isInvalid={!!props.isInvalid || invalid}>
        <Label className={cn('mb-0.5', labelClassName)}>{label}</Label>
        <Input
          ref={ref}
          required={!!props.isRequired}
          name={props.name}
          className={cn(inputClassName, {
            'peer border-negative-500': invalid,
          })}
        />
        {description ? (
          <Text slot="description" className="text-sm text-neutral-700 mt-0.5">
            {description}
          </Text>
        ) : null}
        {invalid ? (
          <Text
            slot="errorMessage"
            className="text-sm text-negative-500 mt-0.5
              peer-rac-invalid:transition peer-rac-invalid:ease-in-out peer-rac-invalid:duration-300
              peer-rac-invalid:animate-in peer-rac-invalid:fade-in peer-rac-invalid:slide-in-from-top-4"
          >
            {errorMessage}
          </Text>
        ) : null}
      </AriaTextField>
    );
  }
);

export default function TextField({
  name,
  errorMessage,
  rules,
  ...props
}: Props) {
  return (
    <Controller
      rules={rules}
      name={name}
      render={({ field, formState: { errors } }) => (
        <InternalTextField
          {...props}
          {...field}
          errorMessage={errorMessage ?? errors[name]?.message?.toString()}
        />
      )}
    />
  );
}
