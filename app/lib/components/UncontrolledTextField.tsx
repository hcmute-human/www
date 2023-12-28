import { cn } from '@lib/utils';
import clsx from 'clsx';
import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { Text, TextField, type TextFieldProps } from 'react-aria-components';
import { SwitchTransition } from 'transition-hook';
import Input from './Input';
import Label from './Label';

interface Props extends TextFieldProps {
  name: string;
  label?: ReactNode;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const UncontrolledTextField = forwardRef<HTMLInputElement, Props>(function UncontrolledTextField(
  { label, labelClassName, inputClassName, description, errorMessage, ...props }: Props,
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
      <Label className={cn('mb-0.5 flex items-center gap-1 flex-wrap', labelClassName)}>
        {label}
        {props.isRequired ? <span className="text-primary-300 text-xs font-medium">(required)</span> : null}
        {props.isReadOnly ? <span className="text-info-500 text-xs font-medium">(read-only)</span> : null}
      </Label>
      <Input
        ref={ref}
        className={cn('w-full', inputClassName, {
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
});

export default UncontrolledTextField;
