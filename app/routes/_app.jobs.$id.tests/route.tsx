import i18next from '@lib/i18n/index.server';
import { buildTitle } from '@lib/utils';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';

export const handle = {
  i18n: 'jobs.$id.tests',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export const shouldRevalidate = () => false;

export async function loader({ request }: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'jobs.$id.tests').then((t) => t('meta.title'));
  return json({
    title,
  });
}
