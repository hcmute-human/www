import { useForm, type FormConfig, type Fieldset } from '@conform-to/react';
import { Form as RemixForm, type FormProps } from '@remix-run/react';
import {
  createContext,
  useContext,
  useImperativeHandle,
  type Ref,
} from 'react';

type Props<
  Output extends Record<string, any>,
  Input extends Record<string, any> = Output
> = FormProps & {
  config?: FormConfig<Output, Input>;
  ref?: Ref<HTMLFormElement | null>;
};

const FieldsContext = createContext<Fieldset<Record<string, unknown>> | null>(
  null
);

export function useFormFieldsContext<
  Schema extends Record<string, any> | undefined
>() {
  return useContext<Fieldset<Schema> | null>(FieldsContext as any);
}

export default function Form<Output extends Record<string, any>>({
  config,
  children,
  ref,
  ...props
}: Props<Output, Output>) {
  const [{ props: formProps, ref: formRef }, fields] = useForm(config);
  useImperativeHandle(ref, () => formRef.current);
  return (
    <RemixForm {...props} {...formProps}>
      <FieldsContext.Provider value={fields}>{children}</FieldsContext.Provider>
    </RemixForm>
  );
}
