import i18next from '@lib/i18n/index.server';
import { buildTitle } from '@lib/utils';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';

export const handle = {
  i18n: 'employees',
  breadcrumb: true,
};

export const shouldRevalidate = () => false;

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    title: await i18next.getFixedT(request, 'employees').then((t) => t('meta.title')),
  });
}
