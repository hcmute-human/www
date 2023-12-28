import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import ListBoxItem from '@components/ListBoxItem';
import Loading from '@components/Loading';
import SelectField from '@components/SelectField';
import TextEditor, { type TextEditorCommands } from '@components/TextEditor';
import TextField from '@components/TextField';
import { CheckIcon } from '@heroicons/react/24/outline';
import i18next from '@lib/i18n/index.server';
import type { Department, DepartmentPosition } from '@lib/models/department';
import { JobStatus } from '@lib/models/job';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { fail } from '@lib/utils/action.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { searchParamsRecord } from '@lib/utils/searchParams.server';
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
import { Suspense, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'jobs.new',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:job'] }))) {
    throw redirect('/');
  }

  const { departmentId } = searchParamsRecord(request);
  const departmentsPromise = api.get('departments?size=100').match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<Department>>;
  const positionsPromise = departmentId
    ? (api.get(`departments/${departmentId}/positions?size=100`).match(
        (x) => (x.ok ? x.json() : paginated()),
        () => paginated()
      ) as Promise<Paginated<DepartmentPosition>>)
    : (Promise.resolve(paginated()) as Promise<Paginated<DepartmentPosition>>);
  const title = await i18next.getFixedT(request, 'jobs.new').then((t) => t('meta.title'));
  return defer({ title, departmentsPromise, positionsPromise });
}

interface FieldValues {
  departmentId: string;
  positionId: string;
  title: string;
  description?: string;
}

const schema = (t: TFunction) =>
  z.object({
    departmentId: z.string({ required_error: t('departmentId.required') }),
    positionId: z.string({ required_error: t('positionId.required') }),
    title: z.string({ required_error: t('title.required') }),
    description: z.string({ required_error: t('description.required') }).optional(),
  });

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4 items-start">{children}</div>;
}

export default function Route() {
  const { t } = useTranslation('jobs.new');
  const { title, departmentsPromise, positionsPromise } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const [searchParams, setSearchParams] = useSearchParams();
  const error = lastSubmission?.error ? lastSubmission.error.form ?? lastSubmission.error.issuerId : undefined;
  const commandsRef = useRef<TextEditorCommands>(null);
  const departmentId = searchParams.get('departmentId');

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
              departmentId: departmentId ?? undefined,
              positionId: searchParams.get('positionId') ?? undefined,
            },
            onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
          }}
          onReset={() => {
            commandsRef.current?.clearContent();
          }}
        >
          <FieldGroup>
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
                    onSelectionChange={(key) => {
                      if (key === departmentId) {
                        return;
                      }
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
              <Await resolve={positionsPromise}>
                {({ items }) => (
                  <SelectField
                    name="positionId"
                    label={t('positionId.label')}
                    className="grid w-full content-start"
                    description={t('positionId.description')}
                    onSelectionChange={(key) => {
                      searchParams.set('positionId', key + '');
                      setSearchParams(searchParams);
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
          </FieldGroup>
          <TextField name="title" label={t('title.label')} description={t('title.description')} isRequired />
          <TextEditor
            name="description"
            label={t('description.label')}
            description={t('description.description')}
            editorClassName="h-72 overflow-auto"
            ref={commandsRef}
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
            text={t('success', { name: lastSubmission.value.title })}
            className="animate-distance-2 animate-duration-300 animate-fadeInLeftBig"
          />
        ) : null}
      </div>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const [t, formData] = await Promise.all([i18next.getFixedT(request, 'jobs.new'), request.formData()]);
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:job'] }))) {
    return json(fail({ form: [t('forbidden')] }, submission));
  }

  const result = await SessionApiClient.from(session).post('jobs', {
    body: { ...submission.value, status: JobStatus.None },
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
