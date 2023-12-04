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
import { Gender } from '@lib/models/employee';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'employees',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:employee'] }))) {
    throw redirect('/');
  }

  const title = await i18next.getFixedT(request, 'employees.new').then((t) => t('meta.title'));
  return json({ title });
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
  z
    .object({
      email: z.string({ required_error: t('email.required') }).email(t('email.email')),
      password: z.string({ required_error: t('password.required') }).min(7, t('password.min', { min: 7 })),
      confirmPassword: z.string({
        required_error: t('confirmPassword.required'),
      }),
      firstName: z.string({ required_error: t('firstName.required') }),
      lastName: z.string({ required_error: t('lastName.required') }),
      gender: z.coerce
        .number({
          required_error: t('employmenType.required'),
          invalid_type_error: t('gender.invalidType'),
        })
        .refine((x) => x === Gender.Male || x === Gender.Female, t('gender.invalidType')),
      dateOfBirth: z.string({ required_error: t('dateOfBirth.required') }),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: t('confirmPassword.wrong'),
      path: ['confirmPassword'],
    });

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4">{children}</div>;
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
  const { t } = useTranslation('employees.new');
  const { title } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const ref = useRef(null);

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
              type="email"
              name="email"
              label={t('email.label')}
              description={t('email.description')}
              className="grid w-full"
            />
            <TextField
              type="password"
              name="password"
              label={t('password.label')}
              description={t('password.description')}
              className="grid w-full"
            />
            <TextField
              type="password"
              name="confirmPassword"
              label={t('confirmPassword.label')}
              description={t('confirmPassword.description')}
              className="grid w-full"
            />
          </FieldGroup>
          <FieldGroup>
            <TextField
              name="firstName"
              label={t('firstName.label')}
              description={t('firstName.description')}
              className="grid w-full"
            />
            <TextField
              name="lastName"
              label={t('lastName.label')}
              description={t('lastName.description')}
              className="grid w-full"
            />
          </FieldGroup>
          <FieldGroup>
            <SelectField
              name="gender"
              label="Gender"
              className="grid w-full content-start"
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
              className="w-full"
            />
          </FieldGroup>
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
            text={`Employee '${lastSubmission.value.firstName} ${lastSubmission.value.lastName}' has been created.`}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  const result = await SessionApiClient.from(session).post('employees', {
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
