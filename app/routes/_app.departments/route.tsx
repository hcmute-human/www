import i18next from '@lib/i18n/index.server';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export const handle = {
  i18n: 'meta',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    title: await i18next
      .getFixedT(request, 'departments')
      .then((t) => t('meta.title')),
  });
}

export default function Route() {
  return <Outlet />;
}
