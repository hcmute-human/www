import Tabs from '@components/Tabs';
import i18next from '@lib/i18n/index.server';
import { buildTitle } from '@lib/utils';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Outlet, useLocation } from '@remix-run/react';

export const handle = {
  i18n: 'leaves',
  breadcrumb: true,
};
export const shouldRevalidate = () => false;
export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);
export async function loader({ request }: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'leaves').then((t) => t('meta.title'));
  return json({
    title,
  });
}

export default function Route() {
  const selectedKey = useLocation().pathname.split('/', 4).join('/');
  return (
    <>
      <Tabs
        items={[
          {
            id: `/leaves`,
            href: `/leaves`,
            label: 'General',
          },
          {
            id: `/leaves/types`,
            href: `/leaves/types`,
            label: 'Type',
          },
          {
            id: `/leaves/holidays`,
            href: `/leaves/holidays`,
            label: 'Holiday',
          },
        ]}
        selectedKey={selectedKey}
        className="-mx-4 -mt-4 mb-4 border-b border-primary-100"
      />
      <Outlet />
    </>
  );
}
