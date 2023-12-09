import Tabs from '@components/Tabs';
import i18next from '@lib/i18n/index.server';
import type { Employee } from '@lib/models/employee';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle } from '@lib/utils';
import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useLocation } from '@remix-run/react';

export const handle = {
  i18n: 'employees.$id',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export const shouldRevalidate = () => false;

export async function loader({ request, params: { id }, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  const employee = (await api.get(`employees/${id}`).match(
    (x) => (x.ok ? x.json() : null),
    () => null
  )) as Employee | null;
  if (!employee) {
    throw redirect('/employees');
  }
  const title = await i18next
    .getFixedT(request, 'employees.$id')
    .then((t) => t('meta.title', { name: `${employee.firstName} ${employee.lastName}` }));

  return json({
    id,
    title,
  });
}

export default function Route() {
  const { id } = useLoaderData<typeof loader>();
  const selectedKey = useLocation().pathname.split('/', 4).join('/');
  return (
    <>
      <Tabs
        items={[
          {
            id: `/employees/${id}`,
            href: `/employees/${id}`,
            label: 'General',
          },
          {
            id: `/employees/${id}/permissions`,
            href: `/employees/${id}/permissions`,
            label: 'Permissions',
          },
        ]}
        selectedKey={selectedKey}
        className="-mx-4 -mt-4 mb-4 border-b border-primary-100"
      />
      <Outlet />
    </>
  );
}
