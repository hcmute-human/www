import { forwardRef, useEffect, useRef, useState } from 'react';
import { type NumberFieldProps } from 'react-aria-components';
import { useFormFieldsContext } from './Form';
import UncontrolledNumberField from './UncontrolledNumberField';
import { conform } from '@conform-to/react';

interface Props extends NumberFieldProps {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const NumberField = forwardRef<HTMLInputElement, Props>(function NumberField(
  { defaultValue, errorMessage, onChange, ...props }: Props,
  ref
) {
  const { [props.name]: field } = useFormFieldsContext() ?? {};
  const [value, setValue] = useState(defaultValue ?? field.defaultValue ?? null);
  const shadowInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    shadowInputRef.current?.dispatchEvent(new Event('blur', { cancelable: true, bubbles: true }));
  }, [value]);

  return (
    <>
      <UncontrolledNumberField
        {...props}
        name={undefined!}
        ref={ref}
        value={value}
        onChange={(x) => {
          setValue(x);
          onChange?.(x);
        }}
        errorMessage={errorMessage ?? field?.error}
      />
      <input
        {...conform.input(field, { type: 'text', hidden: true })}
        defaultValue={isNaN(value) ? undefined : value}
        ref={shadowInputRef}
      />
    </>
  );
});

export default NumberField;
