import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import DatePicker from '@components/DatePicker';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import ListBoxItem from '@components/ListBoxItem';
import Loading from '@components/Loading';
import NumberField from '@components/NumberField';
import SelectField from '@components/SelectField';
import { CheckIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import type { Department, DepartmentPosition } from '@lib/models/department';
import { EmploymentType } from '@lib/models/employee';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { fail } from '@lib/utils/action.server';
import { formatEmploymentType } from '@lib/utils/employee';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { searchParams } from '@lib/utils/searchParams.server';
import { makeErrorMap } from '@lib/utils/zod';
import {
  defer,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Await, useActionData, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface FieldValues {
  departmentId: string;
  departmentPositionId: string;
  startTime: string;
  endTime: string;
  salary: number;
}

export const handle = {
  i18n: 'employees.$id.positions.new',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:employeePosition'] }))) {
    throw redirect('/');
  }
  const queryParams = searchParams(request, {});
  const departmentsPromise = api.get('departments').match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<Department>>;
  const departmentId = queryParams.get('departmentId');
  const title = await i18next.getFixedT(request, 'employees.$id.positions.new').then((t) => t('meta.title'));
  return defer({
    title,
    departmentsPromise,
    positionsPromise: (departmentId
      ? api.get(`departments/${departmentId}/positions`).match(
          (x) => (x.ok ? x.json() : paginated()),
          () => paginated()
        )
      : Promise.resolve(paginated())) as Promise<Paginated<DepartmentPosition>>,
  });
}

const schema = (t: TFunction) =>
  z
    .object({
      departmentId: z.string({ required_error: t('departmentId.required') }),
      departmentPositionId: z.string({ required_error: t('departmentPositionId.required') }),
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
      message: 'End time must be after start time',
    });

const employments = [
  { text: formatEmploymentType(EmploymentType.FullTime), value: EmploymentType.FullTime },
  { text: formatEmploymentType(EmploymentType.PartTime), value: EmploymentType.PartTime },
  { text: formatEmploymentType(EmploymentType.Internship), value: EmploymentType.Internship },
];

export default function Route() {
  const { t } = useTranslation('employees.$id.positions.new');
  const { title, departmentsPromise, positionsPromise } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const [searchParams, setSearchParams] = useSearchParams();

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
              departmentId: searchParams.get('departmentId'),
            },
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <div className="flex gap-4">
            <Suspense
              fallback={
                <SelectField
                  name="departmentId"
                  label={t('departmentId.label')}
                  className="grid w-full content-start"
                  description={t('departmentId.description')}
                  isDisabled={true}
                />
              }
            >
              <Await resolve={departmentsPromise}>
                {({ items }) => (
                  <SelectField
                    name="departmentId"
                    label={t('departmentId.label')}
                    className="grid w-full content-start"
                    description={t('departmentId.description')}
                    defaultSelectedKey={searchParams.get('departmentId') ?? undefined}
                    onSelectionChange={(key) => {
                      setSearchParams({ departmentId: key + '' });
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
            <Suspense>
              <Await resolve={positionsPromise}>
                {({ items }) => (
                  <SelectField
                    name="departmentPositionId"
                    label={t('departmentPositionId.label')}
                    className="grid w-full content-start"
                    description={t('departmentPositionId.description')}
                    isDisabled={!searchParams.has('departmentId')}
                    disabledKeys={['none']}
                    isRequired
                  >
                    {items.length ? (
                      items.map(({ id, name }) => (
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
                      ))
                    ) : (
                      <ListBoxItem id="none" textValue="The department has no positions.">
                        <span className="text-primary-700">
                          <i>The department has no positions.</i>
                        </span>
                      </ListBoxItem>
                    )}
                  </SelectField>
                )}
              </Await>
            </Suspense>
          </div>
          <SelectField
            name="employmentType"
            label={t('employmentType.label')}
            className="grid w-full content-start"
            description={t('employmentType.description')}
            isRequired
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
            isRequired
          />
          <DatePicker
            name="endTime"
            label={t('endTime.label')}
            description={t('endTime.description')}
            className="grid"
            isRequired
          />
          <NumberField
            name="salary"
            label={t('salary.label')}
            description={t('salary.description')}
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
            text={`Position created.`}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ params: { id }, request, context: { session } }: ActionFunctionArgs) {
  const api = SessionApiClient.from(session);
  const t = await i18next.getFixedT(request, 'employees.$id.positions.new');
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }
  if (!(await api.authorize({ permissions: ['create:employeePosition'] }))) {
    return json(fail({ form: [t('forbidden')] }, submission));
  }

  const result = await api.post(`employees/${id}/positions`, {
    body: { ...submission.value, departmentId: undefined },
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
