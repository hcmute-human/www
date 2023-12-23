import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import Loading from '@components/Loading';
import NumberField from '@components/NumberField';
import TextField from '@components/TextField';
import i18next from '@lib/i18n/index.server';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'leave.types.new',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:leaveType'] }))) {
    throw redirect('/');
  }

  const title = await i18next.getFixedT(request, 'leaves.types.new').then((t) => t('meta.title'));
  return json({ title });
}

interface FieldValues {
  name: string;
  days: number;
  description?: string;
}

const schema = (t: TFunction) =>
  z.object({
    name: z.string({ required_error: t('name.required') }),
    days: z.coerce
      .number({
        required_error: t('days.required'),
        invalid_type_error: t('days.invalidType'),
      })
      .min(0, t('days.min', { min: 0 })),
    description: z.string().optional(),
  });

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4 items-start">{children}</div>;
}

export default function Route() {
  const { t } = useTranslation('leaves.types.new');
  const { title } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  return (
    <>
      <h1>{title}</h1>
      <div className="grid gap-4 mt-4 max-w-screen-lg">
        {lastSubmission?.error?.form ? (
          <BoxAlert variant="negative" title="Unable to create employee" body={lastSubmission.error.form[0]} />
        ) : null}
        <Form<FieldValues>
          className="grid gap-4 w-full"
          action="?"
          method="post"
          config={{
            lastSubmission,
            shouldValidate: 'onBlur',
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <FieldGroup>
            <TextField
              type="name"
              name="name"
              label={t('name.label')}
              description={t('name.description')}
              isRequired
              className="grid w-full"
            />
            <NumberField
              name="days"
              label={t('days.label')}
              description={t('days.description')}
              isRequired
              className="grid w-full"
            />
          </FieldGroup>
          <TextField
            name="description"
            label={t('description.label')}
            description={t('description.description')}
            className="grid w-full"
          />
          <div className="flex gap-4">
            <Button type="submit" className="w-fit" isDisabled={submitting}>
              <Loading loading={submitting}>{t('create')}</Loading>
            </Button>
            <Button type="reset" variant="primary" className="w-fit">
              {t('reset')}
            </Button>
          </div>
        </Form>
        {!submitting && lastSubmission?.ok === true ? (
          <InlineAlert
            variant="positive"
            text={`Leave type '${lastSubmission.value.name} has been created.`}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request, 'leaves.types.new');
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  const result = await SessionApiClient.from(session).post('leave-types', {
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
