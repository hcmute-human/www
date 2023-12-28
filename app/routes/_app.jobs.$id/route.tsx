import Tabs from '@components/Tabs';
import i18next from '@lib/i18n/index.server';
import type { Job } from '@lib/models/job';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle } from '@lib/utils';
import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useLocation } from '@remix-run/react';

export const handle = {
  i18n: 'jobs.$id',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export const shouldRevalidate = () => false;

export async function loader({ request, params: { id }, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  const job = (await api.get(`jobs/${id}`).match(
    (x) => (x.ok ? x.json() : null),
    () => null
  )) as Job | null;
  if (!job) {
    throw redirect('/jobs');
  }
  const title = await i18next.getFixedT(request, 'jobs.$id').then((t) => t('meta.title', { name: job.title }));

  return json({
    id,
    title,
    job,
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
            id: `/jobs/${id}`,
            href: `/jobs/${id}`,
            label: 'General',
          },
          {
            id: `/jobs/${id}/tests`,
            href: `/jobs/${id}/tests`,
            label: 'Tests',
          },
        ]}
        selectedKey={selectedKey}
        className="-mx-4 -mt-4 mb-4 border-b border-primary-100"
      />
      <Outlet />
    </>
  );
}
