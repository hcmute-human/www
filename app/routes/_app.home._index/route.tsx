import i18next from '@lib/i18n/index.server';
import { buildTitle } from '@lib/utils';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';

export const handle = {
  i18n: 'home',
  breadcrumb: true,
};

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'home').then((t) => t('meta.title'));
  return json({ title, id: session.decode().sub });
}

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

function Home() {
  return <div>Homepage</div>;
}

export default Home;
