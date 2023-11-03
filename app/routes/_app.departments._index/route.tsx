import i18next from '@lib/i18n/index.server';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import {
  filterable,
  pageable,
  searchParams,
} from '@lib/utils/searchParams.server';
import {
  defer,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import DepartmentTable from './DepartmentTable';
import type { GetDepartmentsResult } from './types';
import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/20/solid';

export const handle = {
  i18n: 'departments',
};

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title }];
};

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const params = filterable(pageable(searchParams(request)), 'name');
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['read:department'] }))) {
    throw redirect('/');
  }

  const departmentsPromise = api.get(`departments?${params.toString()}`).match(
    (x) =>
      x.ok
        ? (x.json() as Promise<GetDepartmentsResult>)
        : { totalCount: 0, items: [] },
    () => ({ totalCount: 0, items: [] })
  ) as Promise<GetDepartmentsResult>;
  const title = await i18next
    .getFixedT(request, 'departments')
    .then((t) => t('meta.title'));

  return defer({
    title,
    departmentsPromise,
  });
}

export default function Route() {
  const { title, departmentsPromise } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex justify-between items-center gap-8">
        <h1>{title}</h1>
        <Button
          as="link"
          href="/departments/new"
          className="w-fit flex gap-2 items-center capitalize"
        >
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
