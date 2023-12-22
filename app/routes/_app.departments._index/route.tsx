import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { pageable, searchParams } from '@lib/utils/searchParams.server';
import { defer, json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import DepartmentTable from './DepartmentTable';
import type { GetDepartmentsResult } from './types';

export const handle = {
  i18n: 'departments',
};

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const params = pageable(
    searchParams(request, {
      order: '-createdTime',
    })
  );

  const api = SessionApiClient.from(session);
  const departmentsPromise = api.get(`departments?${params.toString()}`).match(
    (x) => (x.ok ? (x.json() as Promise<GetDepartmentsResult>) : paginated()),
    () => paginated()
  ) as Promise<GetDepartmentsResult>;
  const title = await i18next.getFixedT(request, 'departments').then((t) => t('meta.title'));

  return defer({
    title,
    departmentsPromise,
  });
}

export default function Route() {
  const { departmentsPromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('departments');

  return (
    <>
      <div className="flex justify-between items-center gap-8">
        <h1>{t('h1')}</h1>
        <Button as="link" href="/departments/new" className="w-fit flex gap-2 items-center capitalize">
          <PlusCircleIcon className="w-4" />
          <span className="mr-1">Create department</span>
        </Button>
      </div>
      <Suspense fallback="Loading">
        <Await resolve={departmentsPromise}>
          <DepartmentTable />
        </Await>
      </Suspense>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const api = SessionApiClient.from(session);
  const formData = await request.formData();
  if (formData.get('_action') === 'delete') {
    const result = await api.delete(`departments/${formData.get('id')}`);
    if (result.isErr()) {
      return json({
        ok: false,
        error: await toActionErrorsAsync(result.error),
        id: formData.get('id') as string,
      });
    }
    return json({ ok: true });
  }
  return json(null);
}
