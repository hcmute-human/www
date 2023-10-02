import Button from '@components/Button';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { useForm } from '@conform-to/react';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { parseSubmission, parseSubmissionAsync, toActionErrorsAsync } from '@lib/utils.server';
import { json, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import { SwitchTransition } from 'transition-hook';
import { z } from 'zod';

interface FieldValues {
  email: string;
}

const schema = z.object({
  email: z.string().email(),
});

function SuccessAlert() {
  return (
    <>
      <div className="px-4 py-2 border border-positive-500 bg-neutral-50 rounded">
        <h2 className="text-base font-bold leading-body mb-2">
          Check your inbox
        </h2>
        <p className="text-neutral-700">
          You{"'"}ll receive a link to reset your password in your inbox
          shortly.
        </p>
      </div>
      <div className="mt-4">
        <Button as="link" to="/login">Back to login</Button>
      </div>
    </>
  );
}

export default function Route() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { email }] = useForm<FieldValues>({
    lastSubmission,
    shouldValidate: 'onBlur',
    defaultValue: {
      email: '',
    },
    onValidate: ({ formData }) => parseSubmission(formData, { schema })
  });
  const error = lastSubmission?.error.form ?? lastSubmission?.error.token;
  const { state } = useNavigation();
  const ok = !!lastSubmission?.ok;

  return (
    <div className="w-[20rem]">
      <h1 className="font-bold mb-8">Forgot password?</h1>
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
              <SuccessAlert />
            ) : (
              <Form
                action="?"
                method="post"
                className="grid gap-6"
                {...form.props}
              >
                <TextField
                  isRequired
                  name="email"
                  type="email"
                  label="Email address"
                  description="Enter your account's email address that will receive a reset link."
                  className="grid"
                  errorMessage={email.error}
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
                      Send reset email
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
                    Back
                  </Button>
                </div>
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
            )}
          </div>
        )}
      </SwitchTransition>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, { schema });

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
