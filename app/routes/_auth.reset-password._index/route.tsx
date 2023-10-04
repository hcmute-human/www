import Button from '@components/Button';
<<<<<<< HEAD
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { useForm } from '@conform-to/react';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { toActionErrorsAsync } from '@lib/utils.server';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { json, type ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import { SwitchTransition } from 'transition-hook';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import i18next from '@lib/i18n/index.server';
import InlineAlert from '@components/InlineAlert';
import Form from '@components/Form';
=======
import Form from '@components/Form';
import Link from '@components/Link';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { Transition } from '@headlessui/react';
import { useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import { z } from 'zod';
>>>>>>> c1d6c3f (wip)

interface FieldValues {
  email: string;
}

<<<<<<< HEAD
function schema(t: TFunction) {
  return z.object({
    email: z
      .string({ required_error: t('email.required') })
      .email(t('email.invalid')),
  });
}

export default function Route() {
  const { t } = useTranslation('reset-password');
  const lastSubmission = useActionData<typeof action>();
  const error = lastSubmission?.error.form ?? lastSubmission?.error.token;
  const { state } = useNavigation();
  const ok = !!lastSubmission?.ok;

  return (
    <div className="w-[20rem]">
      <h1 className="font-bold mb-8">{t('h1')}?</h1>
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
                <InlineAlert
                  variant="positive"
                  title={t('successAlert.title')}
                  body={t('successAlert.body') + '.'}
                />
                <div className="mt-4">
                  <Button as="link" to="/login">
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
                    email: '',
                  },
                  onValidate: ({ formData }) =>
                    parseSubmission(formData, { schema: schema(t) }),
                }}
              >
                <TextField
                  isRequired
                  name="email"
                  type="email"
                  label={t('email.label')}
                  description={t('email.description')}
                  className="grid"
                />
                <div className="flex gap-4">
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
                        isIndeterminate
                        className="w-full h-full text-neutral-500"
                        aria-label="signing in"
                      />
                    </Transition>
                  </Button>
                  <Button
                    as="link"
                    type="button"
                    variant="primary"
                    className="w-fit"
                    to="/login"
                  >
                    {t('back')}
                  </Button>
                </div>
                <Transition
                  show={state !== 'submitting' && !!error}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0 translate-y-8"
                  leave="transition ease-in-out duration-300"
                  leaveTo="opacity-0 translate-y-2"
                >
                  <InlineAlert
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

export async function action({ request }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  interface ResetPasswordResponse {
    token: string;
  }

  const result = await ApiClient.instance.post('auth/reset-password', {
    body: submission.value,
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

  const body = (await result.value.body.json()) as ResetPasswordResponse;
  const sendResult = await ApiClient.instance.post('emails/send', {
    body: {
      subject: 'Human account password reset',
      templateKey: 'ResetPassword',
      templateModel: {
        ReturnUrl: `http://localhost:3000/reset-password/${body.token}`,
      },
      recipients: [
        { email: submission.value.email, name: 'duydang2412@gmail.com' },
      ],
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
    },
  });

  if (sendResult.isErr()) {
    return json({
      ...submission,
      ok: false,
      error: await toActionErrorsAsync(sendResult.error),
    });
  }

  return json(submission);
}
=======
const schema = z.object({
  email: z.string().email(),
});

export default function Route() {
  const data = useActionData<{ errors: ActionError }>();
  const error = data?.errors?.root;
  const { state } = useNavigation();

  return (
    <div className="w-[20rem]">
      <h1 className="font-bold">Reset your password.</h1>
      <Form<FieldValues>
        action="?"
        method="post"
        options={{
          schema: schema,
          mode: 'onChange',
          delayError: 200,
          defaultValues: {
            email: '',
          },
          progressive: true,
          criteriaMode: 'all',
        }}
        onSubmit={(e) => {
          console.log(
            Object.fromEntries(
              new FormData(e.currentTarget as HTMLFormElement).entries()
            )
          );
        }}
        className="grid gap-6 mt-8"
      >
        <TextField
          isRequired
          name="email"
          type="email"
          label="Email address"
          description="Enter the email address being resetted."
          className="grid"
        />
        <Button
          type="submit"
          className="relative w-fit bg-primary-500"
          isDisabled={state === 'submitting'}
        >
          <span
            className={clsx('block transition ease-in-out', {
              'opacity-0': state === 'submitting',
              'scale-0': state === 'submitting',
            })}
          >
            Reset
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
              className="w-full h-full text-neutral-500"
              aria-label="signing in"
            />
          </Transition>
        </Button>
        {/* <Link to="/login">Back to login</Link> */}
        <Transition
          show={state !== 'submitting' && !!error}
          enter="transition ease-in-out"
          enterFrom="opacity-0 translate-y-8"
          leave="transition ease-in-out duration-300"
          leaveTo="opacity-0 translate-y-2"
        >
          <div className="px-4 py-2 border border-negative-500 bg-neutral-50 rounded duration-500 animate-in fade-in">
            <h2 className="text-base font-bold leading-body mb-2">
              Unable to process your request
            </h2>
            <p className="text-neutral-700">{error}</p>
          </div>
        </Transition>
      </Form>
    </div>
  );
}
>>>>>>> c1d6c3f (wip)
