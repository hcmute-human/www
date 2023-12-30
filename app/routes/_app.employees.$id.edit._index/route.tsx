import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import DatePicker from '@components/DatePicker';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import ListBoxItem from '@components/ListBoxItem';
import Loading from '@components/Loading';
import SelectField from '@components/SelectField';
import TextField from '@components/TextField';
import { CheckIcon } from '@heroicons/react/24/outline';
import i18next from '@lib/i18n/index.server';
import { Gender, type Employee } from '@lib/models/employee';
import type { User } from '@lib/models/user';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, jsonPatch, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { parseDateFromAbsolute } from '@lib/utils/date';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'employees.$id.edit',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session }, params: { id } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['update:employee'] }))) {
    throw redirect('/employees');
  }

  const [user, employee]: [User | null, Employee | null] = await Promise.all([
    api.get(`users/${id}`).match(
      (x) => (x.ok ? x.json() : null),
      () => null
    ),
    api.get(`employees/${id}`).match(
      (x) => (x.ok ? x.json() : null),
      () => null
    ),
  ]);
  if (!user || !employee) {
    throw redirect('/employees');
  }
  const title = await i18next.getFixedT(request, 'employees.$id.edit').then((t) => t('meta.title'));
  return json({ title, user, employee });
}

interface FieldValues {
  email: string;
  password: string;
  confirmPassword: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

const schema = (t: TFunction) =>
  z.object({
    email: z.string({ required_error: t('email.required') }).email(t('email.email')),
    firstName: z.string({ required_error: t('firstName.required') }),
    lastName: z.string({ required_error: t('lastName.required') }),
    gender: z.coerce
      .number({
        required_error: t('employmentType.required'),
        invalid_type_error: t('gender.invalidType'),
      })
      .refine((x) => x === Gender.Male || x === Gender.Female, t('gender.invalidType')),
    dateOfBirth: z.string({ required_error: t('dateOfBirth.required') }),
  });

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4">{children}</div>;
}

const genderNames = {
  [Gender.Male]: 'Male',
  [Gender.Female]: 'Female',
};

const genders = [
  { key: 1, value: Gender.Male },
  { key: 2, value: Gender.Female },
];

export default function Route() {
  const { t } = useTranslation('employees.$id.edit');
  const { title, user, employee } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const error = lastSubmission?.error ? lastSubmission.error.form?.[0] ?? lastSubmission.error.patch?.[0] : null;

  return (
    <>
      <h1>{title}</h1>
      <div className="grid gap-4 mt-4">
        {error ? <BoxAlert variant="negative" title="Unable to create employee" body={error} /> : null}
        <Form<FieldValues>
          className="grid gap-4 w-full"
          action="?"
          method="post"
          config={{
            lastSubmission,
            shouldValidate: 'onBlur',
            defaultValue: {
              ...employee,
              email: user.email,
              dateOfBirth: parseDateFromAbsolute(employee.dateOfBirth),
            },
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <FieldGroup>
            <TextField
              name="firstName"
              label={t('firstName.label')}
              description={t('firstName.description')}
              isRequired
              className="grid w-full"
            />
            <TextField
              name="lastName"
              label={t('lastName.label')}
              description={t('lastName.description')}
              isRequired
              className="grid w-full"
            />
            <TextField
              type="email"
              name="email"
              label={t('email.label')}
              description={t('email.description')}
              isRequired
              className="grid w-full"
            />
            <SelectField
              name="gender"
              label="Gender"
              className="grid w-full content-start"
              isRequired
              description={t('gender.description')}
            >
              {genders.map(({ key, value }) => (
                <ListBoxItem className="flex justify-between" key={key} id={value} textValue={genderNames[value]}>
                  {({ isSelected }) => (
                    <>
                      <span>{genderNames[value]}</span>
                      {isSelected ? <CheckIcon className="text-accent-500 w-4 h-4 group-hover:text-inherit" /> : null}
                    </>
                  )}
                </ListBoxItem>
              ))}
            </SelectField>
            <DatePicker
              name="dateOfBirth"
              label={t('dateOfBirth.label')}
              description={t('dateOfBirth.description')}
              isRequired
              className="w-full"
            />
          </FieldGroup>
          <div className="flex gap-4">
            <Button type="submit" className="w-fit" isDisabled={submitting}>
              <Loading loading={submitting}>{t('update')}</Loading>
            </Button>
            <Button type="reset" variant="primary" className="w-fit">
              {t('reset')}
            </Button>
          </div>
        </Form>
        {!submitting && lastSubmission?.ok === true ? (
          <InlineAlert
            variant="positive"
            text={t('success', { name: `${employee.firstName} ${employee.lastName}` })}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ request, context: { session }, params: { id } }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request, 'employees.$id.edit');
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  const api = SessionApiClient.from(session);
  const [patchEmployeeResult, patchUserResult] = await Promise.all([
    api.patch(`employees/${id}`, {
      body: jsonPatch(({ replace }) => [
        replace(`/firstName`, formData.get('firstName')),
        replace(`/lastName`, formData.get('lastName')),
        replace(`/gender`, Number(formData.get('gender'))),
        replace(`/dateOfBirth`, new Date(formData.get('dateOfBirth') as string)),
      ]),
    }),
    api.patch(`users/${id}`, {
      body: jsonPatch(({ replace }) => [replace(`/email`, formData.get('email'))]),
    }),
  ]);

  const errors = [
    patchEmployeeResult.isErr() ? patchEmployeeResult.error : null,
    patchUserResult.isErr() ? patchUserResult.error : null,
  ].filter((x) => x);
  if (errors.length) {
    return json({
      ...submission,
      ok: false,
      error: { ...(await toActionErrorsAsync(errors[0])) },
    });
  }

  if (patchEmployeeResult.isErr()) {
    return json({
      ...submission,
      ok: false,
      error: await toActionErrorsAsync(patchEmployeeResult.error),
    });
  }

  return json({ ...submission, ok: true });
}
