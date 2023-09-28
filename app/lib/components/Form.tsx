import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form as RemixForm,
  useActionData,
  type FormProps,
} from '@remix-run/react';
import { useEffect } from 'react';
import {
  type FieldValues,
  FormProvider,
  type Path,
  type UseFormProps,
  useForm,
} from 'react-hook-form';

type Props<T extends FieldValues> = FormProps & {
  options?: Omit<UseFormProps<T>, 'resolver'> &
    Partial<{ schema: Zod.ZodType }>;
};

export default function Form<T extends FieldValues>({
  options,
  ...props
}: Props<T>) {
  const methods = useForm<T>({
    ...options,
    resolver: options?.schema ? zodResolver(options.schema) : undefined,
  });

  const data = useActionData<{ errors?: Record<string, string> }>();
  const errors = data?.errors as Record<string, string> | undefined;

  useEffect(() => {
    if (!errors) {
      return;
    }

    for (const [k, v] of Object.entries(errors)) {
      methods.setError(k as Path<T>, { message: v });
    }
  }, [errors, methods]);

  return (
    <FormProvider {...methods}>
      <RemixForm {...props} />
    </FormProvider>
  );
}
