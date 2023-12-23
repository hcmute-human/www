import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import DatePicker from '@components/DatePicker';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import Loading from '@components/Loading';
import TextField from '@components/TextField';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import i18next from '@lib/i18n/index.server';
import type { Holiday } from '@lib/models/holiday';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { fail } from '@lib/utils/action.server';
import { parseDateFromAbsolute } from '@lib/utils/date';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { makeErrorMap } from '@lib/utils/zod';
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'leaves.holidays.$id.edit',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session }, params: { id } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['update:holiday'] }))) {
    throw redirect('/');
  }

  const holiday = (await api.get(`holidays/${id}`).match(
    (x) => (x.ok ? x.json() : null),
    () => null
  )) as Holiday | null;
  if (!holiday) {
    throw redirect('/');
  }
  const title = await i18next.getFixedT(request, 'leaves.holidays.$id.edit').then((t) => t('meta.title'));
  return json({ title, holiday });
}

interface FieldValues {
  name: string;
  startTime: Date;
  endTime?: Date;
}

const schema = (t: TFunction) =>
  z
    .object({
      name: z.string({ required_error: t('name.required') }),
      startTime: z.coerce.date({
        errorMap: makeErrorMap({
          required: t('startTime.required'),
          invalid_type: t('startTime.required'),
          invalid_date: t('startTime.required'),
        }),
      }),
      endTime: z.coerce
        .date({
          errorMap: makeErrorMap({
            required: t('endTime.required'),
            invalid_type: t('endTime.required'),
            invalid_date: t('endTime.required'),
          }),
        })
        .optional(),
    })
    .refine((x) => (x.endTime == null ? true : x.endTime >= x.startTime), {
      message: t('endTime.mustBeAfterStartTime'),
      path: ['endTime'],
    });

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4 items-start">{children}</div>;
}

export default function Route() {
  const { t } = useTranslation('leaves.holidays.$id.edit');
  const { title, holiday } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  return (
    <>
      <h1>{title}</h1>
      <div className="grid gap-4 mt-4 max-w-screen-lg">
        {lastSubmission?.error?.form ? (
          <BoxAlert variant="negative" title={t('creationFailed')} body={lastSubmission.error.form[0]} />
        ) : null}
        <Form<FieldValues>
          className="grid gap-4 w-full"
          action="?"
          method="post"
          config={{
            lastSubmission,
            shouldValidate: 'onBlur',
            defaultValue: {
              ...holiday,
              startTime: parseDateFromAbsolute(holiday.startTime),
              endTime: parseDateFromAbsolute(holiday.endTime),
            },
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <TextField type="text" name="id" label={t('id.label')} isReadOnly className="grid w-full" />
          <TextField
            type="text"
            name="name"
            label={t('name.label')}
            description={t('name.description')}
            isRequired
            className="grid w-full"
          />
          <FieldGroup>
            <DatePicker
              name="startTime"
              label={t('startTime.label')}
              description={t('startTime.description')}
              isRequired
              minValue={new CalendarDate(today(getLocalTimeZone()).year, 1, 1)}
              maxValue={new CalendarDate(today(getLocalTimeZone()).year, 12, 31)}
              className="grid w-full"
            />
            <DatePicker
              name="endTime"
              label={t('endTime.label')}
              description={t('endTime.description')}
              minValue={new CalendarDate(today(getLocalTimeZone()).year, 1, 1)}
              maxValue={new CalendarDate(today(getLocalTimeZone()).year, 12, 31)}
              className="grid w-full"
            />
          </FieldGroup>
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
            text={t('success', { name: lastSubmission.value.name }) + '.'}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ request, context: { session }, params: { id } }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request, 'leaves.holidays.$id.edit');
  const api = SessionApiClient.from(session);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }
  if (!api.authorize({ permissions: ['update:holiday'] })) {
    return json(fail({ form: [t('forbidden')] }, submission));
  }

  const result = await SessionApiClient.from(session).put(`holidays/${id}`, {
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
