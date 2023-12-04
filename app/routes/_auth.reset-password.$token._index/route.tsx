import Button from '@components/Button';
import Form from '@components/Form';
import BoxAlert from '@components/BoxAlert';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { Transition } from '@headlessui/react';
import i18next from '@lib/i18n/index.server';
import { ApiClient } from '@lib/services/api-client.server';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { SwitchTransition } from 'transition-hook';
import { z } from 'zod';

interface FieldValues {
  password: string;
  confirmPassword: string;
}

function schema(t: TFunction) {
  return z
    .object({
      password: z
        .string({ required_error: t('password.required') })
        .min(7, t('password.min', { length: 7 })),
      confirmPassword: z.string({
        required_error: t('confirmPassword.required'),
      }),
    })
    .refine((x) => x.password === x.confirmPassword, {
      message: t('confirmPassword.incorrect'),
      path: ['confirmPassword'],
    });
}

export function handle() {
  return { i18n: 'reset-password-$token' };
}

export function loader({ params }: LoaderFunctionArgs) {
  if (!params.token) {
    return redirect('/');
  }
  return { token: params.token };
}

export default function Route() {
  const { t } = useTranslation('reset-password-$token');
  const lastSubmission = useActionData<typeof action>();
  const error = lastSubmission?.error.form ?? lastSubmission?.error.token;
  const { state } = useNavigation();
  const ok = !!lastSubmission?.ok;

  return (
    <div className="w-[20rem]">
      <h1 className="font-bold mb-8">{t('h1')}.</h1>
      <SwitchTransition state={ok} timeout={500} mode="out-in">
        {(ok, stage) => (
          <div
            className={clsx(
              'transition-[opacity_transform] duration-500 ease-in-out',
              {
                from: 'opacity-0 scale-105',
                enter: '',
                leave: 'opacity-0 scale-95',
              }[stage]
            )}
          >
            {ok ? (
              <>
                <BoxAlert
                  variant="positive"
                  title={t('successAlert.title')}
                  body={t('successAlert.body')}
                />
                <div className="mt-4">
                  <Button as="link" href="/login">
                    {t('successAlert.back')}
                  </Button>
                </div>
              </>
            ) : (
              <Form<FieldValues>
                action="?"
                method="post"
                className="grid gap-6"
                config={{
                  lastSubmission,
                  shouldValidate: 'onBlur',
                  defaultValue: {
                    password: '',
                    confirmPassword: '',
                  },
                  onValidate: ({ formData }) =>
                    parseSubmission(formData, { schema: schema(t) }),
                }}
              >
                <TextField
                  isRequired
                  name="password"
                  type="password"
                  label={t('password.label')}
                  description={t('password.description')}
                  className="grid"
                />
                <TextField
                  isRequired
                  name="confirmPassword"
                  type="password"
                  label={t('confirmPassword.label')}
                  description={t('confirmPassword.description')}
                  className="grid"
                />
                <Button
                  type="submit"
                  className="relative w-fit"
                  isDisabled={state === 'submitting'}
                >
                  <span
                    className={clsx('block transition ease-in-out', {
                      'opacity-0': state === 'submitting',
                      'scale-0': state === 'submitting',
                    })}
                  >
                    {t('submit')}
                  </span>
                  <Transition
                    show={state === 'submitting'}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3"
                    enter="transition ease-in-out"
                    enterFrom="opacity-0 scale-0"
                    leave="transition ease-in-out duration-300"
                    leaveTo="opacity-0 scale-0"
                  >
                    <ProgressCircle
                      className="w-full h-full text-primary-500"
                      aria-label="signing in"
                    />
                  </Transition>
                </Button>
                <Transition
                  show={state !== 'submitting' && !!error}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0 translate-y-8"
                  leave="transition ease-in-out duration-300"
                  leaveTo="opacity-0 translate-y-2"
                >
                  <BoxAlert
                    variant="negative"
                    title={t('unknownError')}
                    body={error?.[0]!}
                  />
                </Transition>
              </Form>
            )}
          </div>
        )}
      </SwitchTransition>
    </div>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  const result = await ApiClient.instance.post(
    `auth/reset-password/${params.token}`,
    {
      body: {
        password: submission.value.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (result.isErr()) {
    return json({
      ...submission,
      ok: false,
      error: await toActionErrorsAsync(result.error),
    });
  }

  return json({ ...submission });
}
