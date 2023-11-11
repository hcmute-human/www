import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Form from '@components/Form';
import BoxAlert from '@components/BoxAlert';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import TextLink from '@components/TextLink';
import { Transition } from '@headlessui/react';
import i18next from '@lib/i18n/index.server';
import { ApiClient } from '@lib/services/api-client.server';
import { commitSession, getSession } from '@lib/services/session.server';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface FieldValues {
  email: string;
  password: string;
  rememberMe?: true;
}

function schema(t: TFunction) {
  return z.object({
    email: z
      .string({ required_error: t('email.required') })
      .email(t('email.invalid')),
    password: z.string({ required_error: t('password.required') }),
    rememberMe: z.boolean().optional(),
  });
}

export function handle() {
  return { i18n: 'login' };
}

export default function Route() {
  const { t } = useTranslation('login');
  const lastSubmission = useActionData<typeof action>();
  const error = lastSubmission?.error?.form;
  const { state } = useNavigation();

  return (
    <div className="w-[20rem]">
      <p className="font-light m-0 text-primary-700 text-center">
        {t('welcomeBack')},
      </p>
      <h1 className="m-0 font-bold text-center">{t('h1')}.</h1>
      <Form<FieldValues>
        action="?"
        method="post"
        className="grid gap-6 mt-8"
        config={{
          lastSubmission,
          defaultValue: {
            email: '',
            password: '',
            rememberMe: true,
          },
          shouldValidate: 'onBlur',
          onValidate: ({ formData }) =>
            parseSubmission(formData, { schema: schema(t) }),
        }}
      >
        <TextField
          isRequired
          name="email"
          type="email"
          label={t('email.label')}
          className="grid"
        />
        <TextField
          isRequired
          name="password"
          type="password"
          label={t('password.label')}
          className="grid"
        />
        <div className="flex justify-between">
          <Checkbox
            isRequired
            id="rememberMe"
            name="rememberMe"
            className="flex gap-x-2 items-center w-fit"
          >
            {t('rememberMe.label')}
          </Checkbox>
          <TextLink href="/reset-password" className="text-sm">
            {t('forgotPassword')}?
          </TextLink>
        </div>
        <Button
          type="submit"
          className="relative w-fit bg-accent-500"
          isDisabled={state === 'submitting'}
        >
          <span
            className={clsx('block transition ease-in-out', {
              'opacity-0': state === 'submitting',
              'scale-0': state === 'submitting',
            })}
          >
            {t('signIn')}
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
              isIndeterminate
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
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  interface LoginResponse {
    accessToken: string;
    refreshToken: string;
  }

  const result = await ApiClient.instance.post('auth/login', {
    body: { ...submission.value, rememberMe: !!submission.value.rememberMe },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (result.isErr()) {
    return json({
      ...submission,
      ok: false,
      error: await toActionErrorsAsync(result.error),
    });
  }

  const body = (await result.value.json()) as LoginResponse;
  const session = await getSession(request);
  session.set('accessToken', body.accessToken);
  session.set('refreshToken', body.refreshToken);
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
