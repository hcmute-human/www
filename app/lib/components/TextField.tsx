import { cn } from '@lib/utils';
import clsx from 'clsx';
import { forwardRef, useEffect, useState } from 'react';
import {
  TextField as AriaTextField,
  Text,
  type TextFieldProps,
} from 'react-aria-components';
import { SwitchTransition } from 'transition-hook';
import { useFormFieldsContext } from './Form';
import Input from './Input';
import Label from './Label';

interface Props extends TextFieldProps {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
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
  const { [props.name]: field } = useFormFieldsContext() ?? {};
  const [errorDisplay, setErrorDisplay] = useState(
    errorMessage ?? field?.error
  );
  const invalid = !!errorMessage || !!field?.error;

  useEffect(() => {
    if (!errorMessage && !field?.error) {
      return;
    }
    setErrorDisplay(errorMessage ?? field?.error);
  }, [errorMessage, field?.error]);

  return (
    <AriaTextField
      defaultValue={field.defaultValue}
      {...props}
      isInvalid={!!props.isInvalid || invalid}
    >
      <Label className={cn('mb-0.5', labelClassName)}>{label}</Label>
      <Input
        ref={ref}
        required={!!props.isRequired}
        name={props.name}
        className={cn(inputClassName, {
          'peer border-negative-500': invalid,
        })}
      />
      <SwitchTransition state={invalid} timeout={200} mode="out-in">
        {(invalid, stage) => (
          <div
            className={clsx(
              'transition-opacity duration-200 text-sm',
              {
                from: 'opacity-0 ease-in',
                enter: '',
                leave: 'opacity-0 ease-out',
              }[stage]
            )}
          >
            {invalid ? (
              <Text slot="errorMessage" className="text-negative-500">
                {errorDisplay + (errorDisplay?.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : description ? (
              <Text slot="description" className="text-primary-700">
                {description + (description.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : null}
          </div>
        )}
      </SwitchTransition>
    </AriaTextField>
  );
});

export default TextField;
