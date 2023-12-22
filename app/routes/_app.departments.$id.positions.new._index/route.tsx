import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import Loading from '@components/Loading';
import TextField from '@components/TextField';
import i18next from '@lib/i18n/index.server';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { fail } from '@lib/utils/action.server';
import { authorize } from '@lib/utils/auth.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface FieldValues {
  name: string;
}

export const handle = {
  i18n: 'departments.$id.positions.new',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  if (!(await authorize(session, { permissions: ['create:departmentPosition'] }))) {
    throw redirect('/');
  }
  const title = await i18next.getFixedT(request, 'departments.$id.positions.new').then((t) => t('meta.title'));
  return json({
    title,
  });
}

const schema = (t: TFunction) =>
  z.object({
    name: z.string({ required_error: t('name.required') }).min(1, t('name.min', { count: 1 })),
  });

export default function Route() {
  const { t } = useTranslation('departments.$id.positions.new');
  const { title } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  return (
    <>
      <h1>{title}</h1>
      <div className="grid gap-4 mt-4 sm:max-w-md">
        {lastSubmission?.error?.form ? (
          <BoxAlert variant="negative" title="Unable to create position" body={lastSubmission.error.form[0]} />
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
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <TextField
            name="name"
            label={t('name.label')}
            description={t('name.description')}
            className="grid"
            isRequired
          />
          <div className="flex gap-4">
            <Button type="submit" className="w-fit" isDisabled={submitting}>
              <Loading loading={submitting}>Create</Loading>
            </Button>
            <Button type="reset" variant="primary" className="w-fit">
              Reset
            </Button>
          </div>
        </Form>
        {!submitting && lastSubmission?.ok === true ? (
          <InlineAlert
            variant="positive"
            text={`Department '${lastSubmission.value.name}' created.`}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ params: { id }, request, context: { session } }: ActionFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:departmentPosition'] }))) {
    return json(fail({ form: ['You do not have privileges to perform this action'] }));
  }

  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  const result = await api.post(`departments/${id}/positions`, {
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
