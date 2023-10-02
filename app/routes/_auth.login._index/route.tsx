import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Link from '@components/Link';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { useForm } from '@conform-to/react';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { commitSession, getSession } from '@lib/services/session.server';
import { parseSubmissionAsync, toActionErrorsAsync } from '@lib/utils.server';
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import { z } from 'zod';

interface FieldValues {
  email: string;
  password: string;
  rememberMe?: true;
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
  rememberMe: z.boolean().optional(),
});

export default function Route() {
  const lastSubmission = useActionData<typeof action>();
  const error = lastSubmission?.error?.form;
  const { state } = useNavigation();
  const [form, { email, password, rememberMe }] = useForm<FieldValues>({
    lastSubmission,
    shouldValidate: 'onBlur',
    defaultValue: {
      email: '',
      password: '',
      rememberMe: 'true',
    },
  });

  return (
    <div className="w-[20rem]">
      <p className="font-light m-0 text-neutral-700 text-center">
        Welcome back,
      </p>
      <h1 className="m-0 font-bold text-center">Sign in to Human.</h1>
      <Form
        action="?"
        method="post"
        className="grid gap-6 mt-8"
        {...form.props}
      >
        <TextField
          isRequired
          name="email"
          type="email"
          label="Email address"
          className="grid"
          defaultValue={email.defaultValue}
          errorMessage={email.error}
        />
        <TextField
          isRequired
          name="password"
          type="password"
          label="Password"
          className="grid"
          defaultValue={password.defaultValue}
          errorMessage={password.error}
        />
        <div className="flex justify-between">
          <Checkbox
            isRequired
            id="rememberMe"
            name="rememberMe"
            className="flex gap-x-2 items-center w-fit"
            defaultSelected={!!rememberMe.defaultValue}
          >
            Remember me
          </Checkbox>
          <Link to="/reset-password" className="text-sm">
            Forgot password?
          </Link>
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
            Sign in
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
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, { schema });

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

  const body = (await result.value.body.json()) as LoginResponse;
  const session = await getSession(request);
  session.set('accessToken', body.accessToken);
  session.set('refreshToken', body.refreshToken);
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
