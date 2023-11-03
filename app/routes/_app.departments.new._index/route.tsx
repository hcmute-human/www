import Button from '@components/Button';
import Form from '@components/Form';
import BoxAlert from '@components/BoxAlert';
import Loading from '@components/Loading';
import TextField from '@components/TextField';
import TextLink from '@components/TextLink';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import InlineAlert from '@components/InlineAlert';

export const handle = {
  i18n: 'departments',
  breadcrumb: () => (
    <TextLink href="/departments/new">Create department</TextLink>
  ),
};

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title }];
};

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['read:department'] }))) {
    throw redirect('/');
  }

  const title = await i18next
    .getFixedT(request, 'departments.new')
    .then((t) => t('meta.title'));
  return json({ title });
}

interface FieldValues {
  name: string;
}

const schema = (t: TFunction) =>
  z.object({
    name: z
      .string({ required_error: t('name.required') })
      .min(1, t('name.min', { count: 1 })),
  });

export default function Route() {
  const { t } = useTranslation('departments.new');
  const { title } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const loading = navigation.state === 'submitting';

  return (
    <>
      <h1>{title}</h1>
      <div className="grid gap-4 mt-4 sm:max-w-md">
        {lastSubmission?.error?.form ? (
          <BoxAlert
            variant="negative"
            title="Unable to create department"
            body={lastSubmission.error.form[0]}
          />
        ) : null}
        <Form<FieldValues>
          className="grid gap-4 w-full"
          action="?"
          method="post"
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
            name="name"
            label={t('name.label')}
            description={t('name.description')}
            className="grid"
            labelClassName="text-base"
          />
          <div className="flex gap-4">
            <Button type="submit" className="w-fit" isDisabled={loading}>
              <Loading loading={loading}>Create</Loading>
            </Button>
            <Button type="reset" variant="primary" className="w-fit">
              Reset
            </Button>
            {lastSubmission?.ok === true ? (
              <InlineAlert
                variant="positive"
                text="Department created."
                className="ml-auto animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
              />
            ) : null}
          </div>
        </Form>
      </div>
    </>
  );
}

export async function action({
  request,
  context: { session },
}: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  const result = await SessionApiClient.from(session).post('departments', {
    body: submission.value,
  });

  if (result.isErr()) {
    return json({
      ...submission,
      ok: false,
      error: await toActionErrorsAsync(result.error),
    });
  }

  return json({ ...submission, ok: true });
}