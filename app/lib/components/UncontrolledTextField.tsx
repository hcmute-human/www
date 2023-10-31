import { cn } from '@lib/utils';
import clsx from 'clsx';
import { forwardRef, useEffect, useState } from 'react';
import { TextField, Text, type TextFieldProps } from 'react-aria-components';
import { SwitchTransition } from 'transition-hook';
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

const UncontrolledTextField = forwardRef<HTMLInputElement, Props>(
  function UncontrolledTextField(
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
    const [errorDisplay, setErrorDisplay] = useState(errorMessage);
    const invalid = !!errorMessage;

    useEffect(() => {
      if (!errorMessage) {
        return;
      }
      setErrorDisplay(errorMessage);
    }, [errorMessage]);

    return (
      <TextField {...props} isInvalid={!!props.isInvalid || invalid}>
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
      </TextField>
    );
  }
);

export default UncontrolledTextField;
