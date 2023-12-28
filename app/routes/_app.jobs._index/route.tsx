import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import i18next from '@lib/i18n/index.server';
import type { LeaveApplication } from '@lib/models/leave';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { fail, ok } from '@lib/utils/action.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { pageable, searchParams } from '@lib/utils/searchParams.server';
import {
  defer,
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type TypedResponse,
  type MetaFunction,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import JobTable from './JobTable';
import { buildTitle } from '@lib/utils';
import { errAsync, fromSafePromise } from 'neverthrow';

export const handle = {
  i18n: 'jobs',
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const params = pageable(
    searchParams(request, {
      order: '-createdTime',
      includeDepartment: 'true',
      includePosition: 'true',
      excludeDescription: 'true',
    })
  );

  const api = SessionApiClient.from(session);
  const jobsPromise = api.get(`jobs?${params.toString()}`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<LeaveApplication>>;

  return defer({
    jobsPromise,
  });
}

export default function Route() {
  const { jobsPromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('jobs');

  return (
    <>
      <div className="flex justify-between items-center gap-8">
        <h1>{t('h1')}</h1>
        <Button as="link" href="/jobs/new" className="w-fit flex gap-2 items-center">
          <PlusCircleIcon className="w-4" />
          <span className="mr-1">{t('createJob')}</span>
        </Button>
      </div>
      <Suspense fallback="Loading">
        <Await resolve={jobsPromise}>
          <JobTable />
        </Await>
      </Suspense>
    </>
  );
}

type ActionResponse = { ok: false; error: ActionError; id: string } | { ok: true } | null;
export async function action({
  request,
  context: { session },
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> {
  const api = SessionApiClient.from(session);
  const formData = await request.formData();
  if (formData.get('_action') === 'delete') {
    return json(
      await api
        .delete(`jobs/${formData.get('id')}`)
        .map(() => ok())
        .mapErr(async (x) => fail(await toActionErrorsAsync(x), { id: formData.get('id') as string }))
        .match<ActionResponse>(
          (x) => x,
          (x) => x
        )
    );
  }
  return json(null);
}
