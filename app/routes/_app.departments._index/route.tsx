import TextLink from '@components/TextLink';
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

export const handle = {
  i18n: ['meta', 'departments'],
  breadcrumb: () => <TextLink href="/departments">Departments</TextLink>,
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
    .getFixedT(request, 'meta')
    .then((t) => t('departments.title'));

  return defer({
    title,
    departmentsPromise,
  });
}

export default function Route() {
  const { departmentsPromise } = useLoaderData<typeof loader>();

  return (
    <>
      <Suspense fallback="Loading">
        <Await resolve={departmentsPromise}>
          <DepartmentTable />
        </Await>
      </Suspense>
    </>
  );
}
