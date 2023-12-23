import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import DatePicker from '@components/DatePicker';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import ListBoxItem from '@components/ListBoxItem';
import Loading from '@components/Loading';
import SelectField from '@components/SelectField';
import TextField from '@components/TextField';
import { CheckIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { LeaveApplicationStatus, type LeaveType } from '@lib/models/leave';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { fail } from '@lib/utils/action.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { makeErrorMap } from '@lib/utils/zod';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  defer,
} from '@remix-run/node';
import { Await, useActionData, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { Suspense, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'leaves.new',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  // if (!(await api.authorize({ permissions: ['read:leaveType', 'apply:leaveApplication'], allPermission: true }))) {
  //   throw redirect('/');
  // }

  const leaveTypesPromise = api.get('leave-types').match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<LeaveType>>;
  const title = await i18next.getFixedT(request, 'leaves.new').then((t) => t('meta.title'));
  return defer({ title, leaveTypesPromise });
}

interface FieldValues {
  leaveTypeId: string;
  startTime: string;
  endTime: string;
  description?: string;
}

const schema = (t: TFunction) =>
  z.object({
    leaveTypeId: z.string({ required_error: t('name.required') }),
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
  });

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4 items-start">{children}</div>;
}

export default function Route() {
  const { t } = useTranslation('leaves.new');
  const { title, leaveTypesPromise } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const [searchParams, setSearchParams] = useSearchParams();
  const error = lastSubmission?.error ? lastSubmission.error.form ?? lastSubmission.error.issuerId : undefined;

  return (
    <>
      <h1>{title}</h1>
      <div className="grid gap-4 mt-4 max-w-screen-lg">
        {error ? <BoxAlert variant="negative" title="Unable to create leave application" body={error[0]} /> : null}
        <Form<FieldValues>
          className="grid gap-4 w-full"
          method="post"
          config={{
            lastSubmission,
            shouldValidate: 'onBlur',
            defaultValue: {
              leaveTypeId: searchParams.get('type') ?? undefined,
            },
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <Suspense
            fallback={
              <SelectField
                name="leaveTypeId"
                label={t('leaveTypeId.label')}
                className="grid w-full content-start"
                description={t('leaveTypeId.description')}
                isDisabled={true}
              />
            }
          >
            <Await resolve={leaveTypesPromise}>
              {({ items }) => (
                <SelectField
                  name="leaveTypeId"
                  label={t('leaveTypeId.label')}
                  className="grid w-full content-start"
                  description={t('leaveTypeId.description')}
                  onSelectionChange={(key) => {
                    setSearchParams({ type: key + '' });
                  }}
                  items={items}
                  isRequired
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
          <FieldGroup>
            <DatePicker
              name="startTime"
              label={t('startTime.label')}
              description={t('startTime.description')}
              isRequired
              className="grid w-full"
            />
            <DatePicker
              name="endTime"
              label={t('endTime.label')}
              description={t('endTime.description')}
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
            text={t('success') + '.'}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const api = SessionApiClient.from(session);
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }
  if (!(await api.authorize({ permissions: ['apply:leaveApplication'] }))) {
    return json(fail({ form: [t('forbidden')] }, submission));
  }

  const result = await SessionApiClient.from(session).post('leave-applications', {
    body: { ...submission.value, status: LeaveApplicationStatus.Pending },
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
