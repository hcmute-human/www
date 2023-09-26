import Button from '@components/Button';
import ControlledTextField from '@components/ControlledTextField';
import Form from '@components/Form';
import MeshGradient from '@components/MeshGradient';
import ProgressCircle from '@components/ProgressCircle';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { commitSession, getSession } from '@lib/services/session.server';
import { toActionErrorsAsync } from '@lib/utils.server';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import { z } from 'zod';

interface FieldValues {
	email: string;
	password: string;
}

const schema = z.object({
	email: z.string().email(),
	password: z.string().nonempty(),
});

export default function Route() {
	const data = useActionData<{ errors: ActionError }>();
	const error = data?.errors?.root;
	const { state } = useNavigation();

	return (
		<>
			<MeshGradient className="fixed w-screen h-screen opacity-5 bg-primary-500" />
			<div className="relative min-h-screen min-w-screen flex justify-center py-[20vh]">
				<div className="w-[20rem]">
					<p className="font-light m-0 text-neutral-700 text-center">
						Welcome back,
					</p>
					<h1 className="m-0 font-bold text-center">Sign in to Human.</h1>
					<Form<FieldValues>
						action="?"
						method="post"
						options={{
							schema: schema,
							mode: 'onChange',
							delayError: 200,
							defaultValues: {
								email: '',
								password: '',
							},
							progressive: true,
							criteriaMode: 'all',
						}}
						className="grid gap-6 mt-8"
					>
						<ControlledTextField
							isRequired
							name="email"
							type="email"
							label="Email address"
							className="grid"
						/>
						<ControlledTextField
							isRequired
							name="password"
							type="password"
							label="Password"
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
			</div>
		</>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const formData = await request.formData();
	const parse = await schema.safeParseAsync({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!parse.success) {
		return Object.fromEntries(
			parse.error.issues.map((x) => [x.path[0], x.code])
		);
	}

	interface LoginResponse {
		accessToken: string;
		refreshToken: string;
	}

	let statusCode: number;
	let body: LoginResponse;
	try {
		[statusCode, body] = await ApiClient.instance
			.post('auth/login', {
				body: parse.data,
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then(async (v) => [
				v.statusCode,
				(await v.body.json()) as LoginResponse,
			]);
		if (statusCode !== 200) {
			return { errors: await toActionErrorsAsync(body) };
		}
	} catch (e) {
		return { errors: await toActionErrorsAsync(e) };
	}

	const session = await getSession(request);
	session.set('accessToken', body.accessToken);
	session.set('refreshToken', body.refreshToken);
	return redirect('/', {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	});
}
