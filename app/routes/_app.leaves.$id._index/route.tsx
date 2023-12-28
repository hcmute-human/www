import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import DatePicker from '@components/DatePicker';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import ListBoxItem from '@components/ListBoxItem';
import Loading from '@components/Loading';
import SelectField from '@components/SelectField';
import TextField from '@components/TextField';
import UncontrolledTextField from '@components/UncontrolledTextField';
import { CheckIcon } from '@heroicons/react/24/outline';
import i18next from '@lib/i18n/index.server';
import { LeaveApplicationStatus, type LeaveApplication, type LeaveType } from '@lib/models/leave';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync, type SubmissionWithOk } from '@lib/utils';
import { fail, ok, type ActionErrorResponse, type ActionOkResponse } from '@lib/utils/action.server';
import { parseDateFromAbsolute } from '@lib/utils/date';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { makeErrorMap } from '@lib/utils/zod';
import {
  defer,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  type TypedResponse,
} from '@remix-run/node';
import { Await, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { type TFunction } from 'i18next';
import { Suspense, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'leaves.$id',
  breadcrumbs: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, params: { id }, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  const leaveTypesPromise = api.get(`leave-types`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<LeaveType>>;
  const [title, leaveApplication, canUpdate] = await Promise.all([
    i18next.getFixedT(request, 'leaves.$id').then((t) => t('meta.title')),
    api.get(`leave-applications/${id}?includeIssuer=true&includeLeaveType=true&includeProcessor=true`).match(
      (x) => (x.ok ? x.json() : null),
      () => null
    ) as Promise<LeaveApplication | null>,
    api.exists(`user-permissions/update:leaveApplication`),
  ]);

  if (!leaveApplication) {
    throw redirect('/leaves');
  }

  return defer({
    id,
    title,
    leaveApplication,
    leaveTypesPromise,
    canUpdate,
  });
}

interface FieldValues {
  leaveTypeId: string;
  startTime: string;
  endTime: string;
  description?: string;
}

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4 items-start">{children}</div>;
}

const statuses = (t: TFunction) => [
  {
    text: t('status.pending'),
    value: LeaveApplicationStatus.Pending,
  },
  {
    text: t('status.approved'),
    value: LeaveApplicationStatus.Approved,
  },
  {
    text: t('status.rejected'),
    value: LeaveApplicationStatus.Rejected,
  },
];

const schema = (t: TFunction) =>
  z.object({
    id: z.string(),
    issuerId: z.string(),
    leaveTypeId: z.string({ required_error: t('leaveTypeId.required') }),
    status: z.coerce.number(),
    startTime: z.coerce.date({
      errorMap: makeErrorMap({
        required: t('startTime.required'),
        invalid_type: t('startTime.invalidType'),
        invalid_date: t('startTime.invalidDate'),
      }),
    }),
    endTime: z.coerce.date({
      errorMap: makeErrorMap({
        required: t('endTime.required'),
        invalid_type: t('endTime.invalidType'),
        invalid_date: t('endTime.invalidDate'),
      }),
    }),
    description: z.string().optional(),
    processorId: z.string().optional(),
  });

export default function Route() {
  const { t } = useTranslation('leaves.$id');
  const { leaveApplication, leaveTypesPromise, canUpdate } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const lastSubmission = useActionData<typeof action>();
  const error =
    lastSubmission?.ok === false && lastSubmission.error
      ? lastSubmission.error.form ?? lastSubmission.error.issuerId
      : undefined;

  return (
    <>
      <h1>{t('h1')}</h1>
      <div className="grid gap-4 mt-4 max-w-screen-lg">
        {error ? <BoxAlert variant="negative" title={t('updateFailed')} body={error[0]} /> : null}
        <Form<FieldValues>
          className="grid gap-4 w-full"
          method="post"
          config={{
            shouldValidate: 'onBlur',
            defaultValue: {
              leaveTypeId: leaveApplication.leaveTypeId,
              startTime: parseDateFromAbsolute(leaveApplication.startTime),
              endTime: parseDateFromAbsolute(leaveApplication.endTime),
              status: leaveApplication.status,
              description: leaveApplication.description,
              processorName: leaveApplication.processor
                ? `${leaveApplication.processor.firstName} ${leaveApplication.processor.lastName}`
                : undefined,
            },
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <input type="hidden" name="issuerId" defaultValue={leaveApplication.issuerId} />
          <input type="hidden" name="processorId" defaultValue={leaveApplication.processorId} />
          <FieldGroup>
            <UncontrolledTextField
              name="id"
              label={t('id.label')}
              defaultValue={leaveApplication.id}
              className="w-full"
              isReadOnly
            />
            <UncontrolledTextField
              name="issuerName"
              label={t('issuerName.label')}
              description={t('issuerName.description')}
              defaultValue={leaveApplication.issuer.firstName + ' ' + leaveApplication.issuer.lastName}
              className="w-full"
              isReadOnly
            />
          </FieldGroup>
          <FieldGroup>
            <Suspense
              fallback={
                <SelectField name="leaveTypeId" label={t('leaveTypeId.label')} className="w-full" isDisabled={true} />
              }
            >
              <Await resolve={leaveTypesPromise}>
                {({ items }) => (
                  <SelectField
                    name="leaveTypeId"
                    label={t('leaveTypeId.label')}
                    className="w-full"
                    items={items}
                    isRequired
                    isDisabled={!canUpdate}
                  >
                    {({ id, name }) => (
                      <ListBoxItem className="flex justify-between" key={id} id={id} textValue={name}>
                        {({ isSelected }) => (
                          <>
                            <span>{name}</span>
                            {isSelected ? (
                              <CheckIcon className="text-accent-500 w-4 h-4 group-hover:text-inherit" />
                            ) : null}
                          </>
                        )}
                      </ListBoxItem>
                    )}
                  </SelectField>
                )}
              </Await>
            </Suspense>
            <SelectField
              name="status"
              label={t('status.label')}
              className="w-full"
              items={statuses(t)}
              isRequired
              isDisabled={!canUpdate}
            >
              {({ text, value }) => (
                <ListBoxItem className="flex justify-between" key={value} id={value} textValue={text}>
                  {({ isSelected }) => (
                    <>
                      <span>{text}</span>
                      {isSelected ? <CheckIcon className="text-accent-500 w-4 h-4 group-hover:text-inherit" /> : null}
                    </>
                  )}
                </ListBoxItem>
              )}
            </SelectField>
          </FieldGroup>
          <FieldGroup>
            <DatePicker
              name="startTime"
              label={t('startTime.label')}
              isRequired
              className="w-full"
              isReadOnly={!canUpdate}
            />
            <DatePicker
              name="endTime"
              label={t('endTime.label')}
              isRequired
              className="w-full"
              isReadOnly={!canUpdate}
            />
          </FieldGroup>
          <TextField name="description" label={t('description.label')} className="w-full" isReadOnly={!canUpdate} />
          <TextField
            name="processorName"
            label={t('processorName.label')}
            description={t('processorName.description')}
            className="w-full"
            isReadOnly
          />
          <div className="flex gap-4">
            <Button type="submit" className="w-fit" isDisabled={!canUpdate || submitting}>
              <Loading loading={submitting}>{t('update')}</Loading>
            </Button>
            <Button type="reset" variant="primary" className="w-fit" isDisabled={!canUpdate}>
              {t('reset')}
            </Button>
          </div>
        </Form>
        {!submitting && lastSubmission?.ok === true ? (
          <InlineAlert
            variant="positive"
            text={t('success') + '.'}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

type ActionResponse = ActionOkResponse | ActionErrorResponse | SubmissionWithOk<ReturnType<typeof schema>>;
export async function action({
  request,
  context: { session },
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> {
  const [t, formData] = await Promise.all([i18next.getFixedT('leaves.$id'), request.formData()]);
  const submission = await parseSubmissionAsync(formData, { schema: schema(t) });
  if (!submission.ok) {
    return json(submission);
  }

  const api = SessionApiClient.from(session);
  const result = await api.put(`leave-applications/${formData.get('id')}`, {
    body: submission.value,
  });
  if (result.isErr()) {
    return json(fail(await toActionErrorsAsync(result.error)));
  }
  return json(ok());
}
