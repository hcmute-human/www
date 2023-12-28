import type { Test } from '@lib/models/job';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { searchParams } from '@lib/utils/searchParams.server';
import { defer, json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Await, useLoaderData, useMatches } from '@remix-run/react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import TestCard from './TestCard';

export const handle = {
  i18n: 'jobs.$id.tests',
};

export async function loader({ request, params: { id }, context: { session } }: LoaderFunctionArgs) {
  const query = searchParams(request, {
    jobId: id!,
    size: '100',
  });
  const api = SessionApiClient.from(session);
  const testsPromise = api.get(`tests?${query.toString()}`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<Test>>;
  return defer({
    id,
    testsPromise,
  });
}

export default function Route() {
  const { title } = useMatches().at(-2)!.data as { title: string };
  const { t } = useTranslation('jobs.$id.tests');
  const { testsPromise } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div>
        <h1>{title}</h1>
      </div>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 mt-2">
        <Suspense fallback={t('loading')}>
          <Await resolve={testsPromise}>
            {({ items }) =>
              items.map((x) => (
                <li key={x.id}>
                  <TestCard test={x} />
                </li>
              ))
            }
          </Await>
        </Suspense>
      </ol>
    </div>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (formData.get('_action') === 'delete') {
    const result = await SessionApiClient.from(session).delete(
      `jobs/${formData.get('employeeId')}/positions/${formData.get('departmentPositionId')}`
    );
    if (result.isErr()) {
      return json({
        ok: false,
        error: await toActionErrorsAsync(result.error),
      });
    }
    return json({ ok: true });
  }
  return json(null);
}
