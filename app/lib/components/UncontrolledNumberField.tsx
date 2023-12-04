import { cn } from '@lib/utils';
import clsx from 'clsx';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { NumberField, Text, type NumberFieldProps } from 'react-aria-components';
import { SwitchTransition } from 'transition-hook';
import Input from './Input';
import Label from './Label';

interface Props extends NumberFieldProps {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const UncontrolledNumberField = forwardRef<HTMLInputElement, Props>(function UncontrolledNumberField(
  { label, labelClassName, inputClassName, description, errorMessage, ...props }: Props,
  ref
) {
  const [errorDisplay, setErrorDisplay] = useState(errorMessage);
  const invalid = !!errorMessage;
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current!);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
    setErrorDisplay(errorMessage);
  }, [errorMessage]);

  return (
    <NumberField {...props} isInvalid={!!props.isInvalid || invalid}>
      <Label className={labelClassName}>{label}</Label>
      <Input
        required={!!props.isRequired}
        className={cn(inputClassName, {
          'peer border-negative-500': invalid,
        })}
        ref={inputRef}
        onBlur={(e) => {
          inputRef.current?.dispatchEvent(new Event('blur', { cancelable: true, bubbles: true }));
          props.onBlur?.(e);
        }}
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
    </NumberField>
  );
});

export default UncontrolledNumberField;
