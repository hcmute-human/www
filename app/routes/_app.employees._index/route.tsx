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
import EmployeeTable from './EmployeeTable';
import type { GetEmployeesResult } from './types';

export const handle = {
  i18n: 'employees',
};

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const params = pageable(
    searchParams(request, {
      order: '-createdTime',
    })
  );

  const api = SessionApiClient.from(session);
  const employeesPromise = api.get(`employees?${params.toString()}`).match(
    (x) => (x.ok ? (x.json() as Promise<GetEmployeesResult>) : paginated()),
    () => paginated()
  ) as Promise<GetEmployeesResult>;
  const title = await i18next.getFixedT(request, 'employees').then((t) => t('meta.title'));

  return defer({
    title,
    employeesPromise,
  });
}

export default function Route() {
  const { employeesPromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('employees');

  return (
    <>
      <div className="flex justify-between items-center gap-8">
        <h1>{t('h1')}</h1>
        <Button as="link" href="/employees/new" className="w-fit flex gap-2 items-center capitalize">
          <PlusCircleIcon className="w-4" />
          <span className="mr-1">Create employee</span>
        </Button>
      </div>
      <Suspense fallback="Loading">
        <Await resolve={employeesPromise}>
          <EmployeeTable />
        </Await>
      </Suspense>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const api = SessionApiClient.from(session);
  const formData = await request.formData();
  if (formData.get('_action') === 'delete') {
    const result = await api.delete(`employees/${formData.get('id')}`);
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
