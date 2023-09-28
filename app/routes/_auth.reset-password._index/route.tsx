import Button from '@components/Button';
import ControlledButton from '@components/ControlledButton';
import Form from '@components/Form';
import Link from '@components/Link';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { toActionErrorsAsync } from '@lib/utils.server';
import type { ActionFunctionArgs } from '@remix-run/node';
import {
  useActionData,
  useNavigation,
  type Navigation,
} from '@remix-run/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { z } from 'zod';

interface FieldValues {
  email: string;
}

const schema = z.object({
  email: z.string().email(),
});

function ResetForm({
  state,
  error,
}: {
  state: Navigation['state'];
  error?: string;
}) {
  return (
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
      className="grid gap-6"
    >
      <TextField
        isRequired
        name="email"
        type="email"
        label="Email address"
        description="Enter your account's email address that will receive a reset link."
        className="grid"
      />
      <ControlledButton
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
      </ControlledButton>
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
  );
}

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
        <Link to="/login">
          <Button type="button">Back to login</Button>
        </Link>
      </div>
    </>
  );
}

export default function Route() {
  const data = useActionData() as Awaited<ReturnType<typeof action>>;
  const error = data?.errors?.root;
  const { state } = useNavigation();
  const success = !!data?.success;
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="w-[20rem]">
      <h1 className="font-bold mb-8">Reset your password.</h1>
      <SwitchTransition>
        <CSSTransition
          key={success + ''}
          nodeRef={ref}
          classNames={{
            enter: 'opacity-0',
            enterActive:
              'transition-opacity duration-1000 ease-in-out opacity-100',
            exit: 'opacity-100',
            exitActive:
              'transition-opacity duration-1000 ease-in-out opacity-0',
          }}
          addEndListener={(done) =>
            ref.current!.addEventListener('transitionend', done, false)
          }
          unmountOnExit
          mountOnEnter
        >
          <div ref={ref}>
            {success ? (
              <SuccessAlert />
            ) : (
              <ResetForm state={state} error={error} />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<
  Either<{ success: true }, { errors: ActionError }>
> {
  const formData = await request.formData();
  const parse = await schema.safeParseAsync({
    email: formData.get('email'),
  });

  if (!parse.success) {
    return { errors: await toActionErrorsAsync(parse.error) };
  }

  interface ResetPasswordResponse {
    token: string;
  }

  try {
    const [ok, json] = await ApiClient.instance
      .post('auth/reset-password', {
        body: parse.data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(
        async (v) =>
          [v.ok, (await v.body.json()) as ResetPasswordResponse] as const
      );
    if (!ok) {
      return { errors: await toActionErrorsAsync(json) };
    }

    await ApiClient.instance.post('emails/send', {
      body: {
        subject: 'Human account password reset',
        templateKey: 'ResetPassword',
        templateModel: {
          ReturnUrl: `http://localhost:3000/reset-password/${json.token}`,
        },
        recipients: [{ email: parse.data.email, name: '' }],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { success: true };
  } catch (e) {
    return { errors: await toActionErrorsAsync(e) };
  }
}
