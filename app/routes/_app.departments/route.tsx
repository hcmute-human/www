import i18next from '@lib/i18n/index.server';
import { buildTitle } from '@lib/utils';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export const handle = {
  i18n: 'departments',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export const shouldRevalidate = () => false;

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    title: await i18next.getFixedT(request, 'departments').then((t) => t('meta.title')),
  });
}

export default function Route() {
  return <Outlet />;
}
