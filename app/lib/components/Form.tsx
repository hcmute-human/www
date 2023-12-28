import { useForm, type Fieldset, type FormConfig, useFieldList } from '@conform-to/react';
import { Form as RemixForm, type FormProps } from '@remix-run/react';
import { createContext, useContext, type RefObject } from 'react';

interface Form {
  id?: string;
  errorId?: string;
  error: string | undefined;
  errors: string[];
  ref: RefObject<HTMLFormElement>;
  props: FormProps;
}
type Props<Output extends Record<string, any>, Input extends Record<string, any> = Output> = FormProps & {
  config?: FormConfig<Output, Input> | [Form, Fieldset<Output>];
};

const FieldsContext = createContext<Fieldset<Record<string, unknown>> | null>(null);

export function useFormFieldsContext<Schema extends Record<string, any> | undefined>() {
  return useContext<Fieldset<Schema> | null>(FieldsContext as any);
}

export default function Form<Output extends Record<string, any>>({
  config,
  children,
  ...props
}: Props<Output, Output>) {
  const [form, fields] = Array.isArray(config) ? config : useForm(config);
  return (
    <RemixForm {...props} {...form.props}>
      <FieldsContext.Provider value={fields}>{children}</FieldsContext.Provider>
    </RemixForm>
  );
}
