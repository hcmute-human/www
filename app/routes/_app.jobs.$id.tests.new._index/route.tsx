import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import Loading from '@components/Loading';
import TextEditor, { type TextEditorCommands } from '@components/TextEditor';
import TextField from '@components/TextField';
import UncontrolledTextField from '@components/UncontrolledTextField';
import { list, useFieldList, useForm } from '@conform-to/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import i18next from '@lib/i18n/index.server';
import { JobStatus } from '@lib/models/job';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { fail } from '@lib/utils/action.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import {
  defer,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useActionData, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { useRef, type ReactNode, useState } from 'react';
import { useField } from 'react-aria';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const handle = {
  i18n: 'jobs.$id.tests.new',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:test'] }))) {
    throw redirect('/');
  }

  const title = await i18next.getFixedT(request, 'jobs.$id.tests.new').then((t) => t('meta.title'));
  return defer({ title });
}

interface FieldValues {
  name: string;
  questions: string[];
}

const schema = (t: TFunction) =>
  z.object({
    name: z.string({ required_error: t('name.required') }),
    questions: z.array(z.string({ required_error: t('questions.required') })),
  });

function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4 items-start">{children}</div>;
}

export default function Route() {
  const { t } = useTranslation('jobs.$id.tests.new');
  const { title } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const error = lastSubmission?.error ? lastSubmission.error.form ?? lastSubmission.error.issuerId : undefined;
  const commandsRef = useRef<TextEditorCommands>(null);
  const [form, fields] = useForm({
    lastSubmission,
    shouldValidate: 'onBlur',
    onValidate: ({ formData }) => parseSubmission(formData, { schema: schema(t) }),
  });
  const questionsFieldList = useFieldList(form.ref, fields.questions);

  return (
    <>
      <h1>{title}</h1>
      <div className="grid gap-4 mt-4 max-w-screen-lg">
        {error ? <BoxAlert variant="negative" title="Unable to create leave application" body={error[0]} /> : null}
        <Form<FieldValues>
          className="grid gap-4 w-full"
          method="post"
          config={[form, fields]}
          onReset={() => {
            commandsRef.current?.clearContent();
          }}
        >
          <TextField name="name" label={t('name.label')} description={t('name.description')} isRequired />
          <ol className="space-y-2">
            {questionsFieldList.map(({ key, name, error }, i) => (
              <li key={key} className="flex items-center gap-1">
                <UncontrolledTextField
                  name={name}
                  label={
                    <>
                      <span>{t('questions.label', { index: i })}</span>
                      <Button
                        type="submit"
                        className="w-fit ml-auto text-negative-500 hover:text-negative-400 !bg-transparent text-xs px-1 py-0"
                        isDisabled={i === 0}
                        {...list.remove(fields.questions.name, { index: i })}
                      >
                        {t('remove')}
                      </Button>
                    </>
                  }
                  description={t('questions.description')}
                  className="flex-grow"
                  errorMessage={error}
                  isRequired
                />
              </li>
            ))}
          </ol>
          <div>
            <div className="flex gap-4">
              <Button type="submit" className="w-fit" isDisabled={submitting}>
                <Loading loading={submitting}>{t('create')}</Loading>
              </Button>
              <Button type="reset" variant="primary" className="w-fit">
                {t('reset')}
              </Button>
              <Button
                type="submit"
                outlined
                variant="primary"
                className="w-fit ml-auto"
                {...list.insert(fields.questions.name)}
              >
                {t('addQuestion')}
              </Button>
            </div>
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
  const [t, formData] = await Promise.all([i18next.getFixedT(request, 'jobs.$id.tests.new'), request.formData()]);
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }
  return json(submission);
  // const api = SessionApiClient.from(session);
  // if (!(await api.authorize({ permissions: ['create:test'] }))) {
  //   return json(fail({ form: [t('forbidden')] }, submission));
  // }

  // const result = await SessionApiClient.from(session).post('jobs', {
  //   body: { ...submission.value, status: JobStatus.None },
  // });

  // if (result.isErr()) {
  //   return json({
  //     ...submission,
  //     ok: false,
  //     error: await toActionErrorsAsync(result.error),
  //   });
  // }

  // return json({ ...submission, ok: true });
}
