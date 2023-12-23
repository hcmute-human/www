import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import DatePicker from '@components/DatePicker';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import ListBoxItem from '@components/ListBoxItem';
import Loading from '@components/Loading';
import NumberField from '@components/NumberField';
import SelectField from '@components/SelectField';
import TextField from '@components/TextField';
import { CheckIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { EmploymentType, type EmployeePosition } from '@lib/models/employee';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { fail } from '@lib/utils/action.server';
import { parseDateFromAbsolute } from '@lib/utils/date';
import { formatEmploymentType } from '@lib/utils/employee';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { makeErrorMap } from '@lib/utils/zod';
import {
  defer,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useActionData, useLoaderData, useMatch, useMatches, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface FieldValues {
  startTime: string;
  endTime: string;
  salary: number;
}

export const handle = {
  i18n: 'employees.$id.positions.$positionId.edit',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session }, params: { id, positionId } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['update:employeePosition'] }))) {
    throw redirect('/');
  }
  const [position, title] = await Promise.all([
    api.get(`employees/${id}/positions/${positionId}?includeDepartment=true&includeDepartmentPosition=true`).match(
      (x) => (x.ok ? x.json() : null),
      () => null
    ) as Promise<EmployeePosition | null>,
    i18next.getFixedT(request, 'employees.$id.positions.$positionId.edit').then((t) => t('meta.title')),
  ] as const);
  if (!position) {
    throw redirect('/');
  }
  return defer({
    title,
    position,
  });
}

const schema = (t: TFunction) =>
  z
    .object({
      employmentType: z.coerce.number({
        required_error: t('employmentType.required'),
        invalid_type_error: t('employmentType.required'),
      }),
      startTime: z.coerce.date({
        errorMap: makeErrorMap({
          required: t('startTime.required'),
          invalid_type: t('startTime.required'),
          invalid_date: t('startTime.required'),
        }),
      }),
      endTime: z.coerce.date({
        errorMap: makeErrorMap({
          required: t('endTime.required'),
          invalid_type: t('endTime.required'),
          invalid_date: t('endTime.required'),
        }),
      }),
      salary: z.coerce
        .number({ required_error: t('salary.required'), invalid_type_error: t('salary.invalidType') })
        .min(1, t('salary.min', { min: 1 })),
    })
    .refine((x) => x.endTime > x.startTime, {
      path: ['endTime'],
      message: 'End time must be later than start time',
    });

const employments = [
  { text: formatEmploymentType(EmploymentType.FullTime), value: EmploymentType.FullTime },
  { text: formatEmploymentType(EmploymentType.PartTime), value: EmploymentType.PartTime },
  { text: formatEmploymentType(EmploymentType.Internship), value: EmploymentType.Internship },
];

export default function Route() {
  const { t } = useTranslation('employees.$id.positions.$positionId.edit');
  const { title, position } = useLoaderData<typeof loader>();
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
          method="post"
          config={{
            lastSubmission,
            shouldValidate: 'onBlur',
            defaultValue: {
              ...position,
              departmentName: position.departmentPosition.department.name,
              positionName: position.departmentPosition.name,
              startTime: parseDateFromAbsolute(position.startTime),
              endTime: parseDateFromAbsolute(position.endTime),
            },
            onValidate: ({ formData }) => {
              console.log(parseSubmission(formData, { schema: schema(t) }));
              return parseSubmission(formData, { schema: schema(t) });
            },
          }}
        >
          <TextField isDisabled type="text" name="departmentName" label="Department" className="grid" />
          <TextField isDisabled type="text" name="positionName" label="Position" className="grid" />
          <SelectField
            name="employmentType"
            label={t('employmentType.label')}
            className="grid w-full content-start"
            description={t('employmentType.description')}
          >
            {employments.map(({ text, value }) => (
              <ListBoxItem className="flex justify-between" key={value} id={value} textValue={text}>
                {({ isSelected }) => (
                  <>
                    <span>{text}</span>
                    {isSelected ? <CheckIcon className="text-accent-500 w-4 h-4 group-hover:text-inherit" /> : null}
                  </>
                )}
              </ListBoxItem>
            ))}
          </SelectField>
          <DatePicker
            name="startTime"
            label={t('startTime.label')}
            description={t('startTime.description')}
            className="grid"
            granularity="day"
          />
          <DatePicker
            name="endTime"
            label={t('endTime.label')}
            description={t('endTime.description')}
            className="grid"
          />
          <NumberField name="salary" label={t('salary.label')} description={t('salary.description')} className="grid" />
          <div className="flex gap-4">
            <Button type="submit" className="w-fit" isDisabled={submitting}>
              <Loading loading={submitting}>Update</Loading>
            </Button>
            <Button type="reset" variant="primary" className="w-fit">
              Reset
            </Button>
          </div>
        </Form>
        {!submitting && lastSubmission?.ok === true ? (
          <InlineAlert
            variant="positive"
            text={`Position has been updated.`}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ params: { id, positionId }, request, context: { session } }: ActionFunctionArgs) {
  const api = SessionApiClient.from(session);
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }
  if (!(await api.authorize({ permissions: ['update:employeePosition'] }))) {
    return json(fail({ form: [t('forbidden')] }, submission));
  }

  const result = await api.put(`employees/${id}/positions/${positionId}`, {
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
