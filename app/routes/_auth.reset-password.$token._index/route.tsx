import Button from '@components/Button';
import Link from '@components/Link';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { useForm } from '@conform-to/react';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { parseSubmissionAsync, toActionErrorsAsync } from '@lib/utils.server';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { SwitchTransition } from 'transition-hook';
import { z } from 'zod';

interface FieldValues {
  password: string;
  confirmPassword: string;
}

const schema = z
  .object({
    password: z.string().min(7),
    confirmPassword: z.string(),
  })
  .refine((x) => x.password === x.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

function SuccessAlert() {
  return (
    <>
      <div className="px-4 py-2 border border-positive-500 bg-neutral-50 rounded">
        <h2 className="text-base font-bold leading-body mb-2">
          Password updated
        </h2>
        <p className="text-neutral-700">
          You can now log in to your account with the new password.
        </p>
      </div>
      <div className="mt-4">
        <Link to="/login">
          <Button type="button">Go to login</Button>
        </Link>
      </div>
    </>
  );
}

export function loader({ params }: LoaderFunctionArgs) {
  if (!params.token) {
    return redirect('/');
  }
  return { token: params.token };
}

export default function Route() {
  const lastSubmission = useActionData<typeof action>();
  const error = lastSubmission?.error.form ?? lastSubmission?.error.token;
  const [form, { password, confirmPassword }] = useForm<FieldValues>({
    lastSubmission,
    shouldValidate: 'onBlur',
    defaultValue: {
      password: '',
      confirmPassword: '',
    },
  });
  const { state } = useNavigation();
  const ok = !!lastSubmission?.ok;

  return (
    <div className="w-[20rem]">
      <h1 className="font-bold mb-8">Reset password.</h1>
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
                  name="password"
                  type="password"
                  label="New password"
                  description="Enter a new password for your account."
                  className="grid"
                  errorMessage={password.error}
                />
                <TextField
                  isRequired
                  name="confirmPassword"
                  type="password"
                  label="Confirm new password"
                  description="Enter the password again."
                  className="grid"
                  errorMessage={confirmPassword.error}
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
                    Update password
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

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, { schema });

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
