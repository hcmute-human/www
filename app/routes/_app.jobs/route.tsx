import i18next from '@lib/i18n/index.server';
import { buildTitle } from '@lib/utils';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';

export const handle = {
  i18n: 'jobs',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request }: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'jobs').then((t) => t('meta.title'));
  return json({
    title,
  });
}
