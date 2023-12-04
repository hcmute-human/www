import i18next from '@lib/i18n/index.server';
import { json, type LoaderFunctionArgs } from '@remix-run/node';

export const handle = {
  i18n: 'departments.$id.positions',
  breadcrumb: true,
};

export const shouldRevalidate = () => false;

export async function loader({ request }: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'departments.$id.positions').then((t) => t('meta.title'));

  return json({
    title,
  });
}
