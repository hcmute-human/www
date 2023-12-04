import Tabs from '@components/Tabs';
import i18next from '@lib/i18n/index.server';
import type { Department } from '@lib/models/department';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData, useLocation } from '@remix-run/react';

export const handle = {
  i18n: 'departments.$id',
  breadcrumb: true,
};

export const shouldRevalidate = () => false;

export async function loader({ request, context: { session }, params }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  const department = await api.get(`departments/${params.id}`).match(
    (x) => x.json() as Promise<Department>,
    () => {
      throw redirect('/');
    }
  );
  const title = await i18next
    .getFixedT(request, 'departments.$id')
    .then((t) => t('meta.title', { name: department.name }));
  return json({
    title,
    department,
  });
}

export default function Route() {
  const { department } = useLoaderData<typeof loader>();
  const selectedKey = useLocation().pathname.split('/', 4).join('/');
  return (
    <>
      <Tabs
        items={[
          {
            id: `/departments/${department.id}`,
            href: `/departments/${department.id}`,
            label: 'General',
          },
          {
            id: `/departments/${department.id}/positions`,
            href: `/departments/${department.id}/positions`,
            label: 'Positions',
          },
          {
            id: `/departments/${department.id}/settings`,
            href: `/departments/${department.id}/settings`,
            label: 'Settings',
          },
        ]}
        selectedKey={selectedKey}
        className="-mx-4 -mt-4 mb-4 border-b border-primary-100"
      />
      <Outlet />
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  return json(null);
}
