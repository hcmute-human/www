import i18next from '@lib/i18n/index.server';
import { buildTitle } from '@lib/utils';
import { authenticate } from '@lib/utils/auth.server';
import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';

export const handle = {
  i18n: 'home',
  breadcrumb: true,
};

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  if (!(await authenticate(session))) {
    session.unset('accessToken');
    session.unset('refreshToken');
    throw redirect('/login');
  }
  const title = await i18next.getFixedT(request, 'home').then((t) => t('meta.title'));
  return json({ title, id: session.decode().sub });
}

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

function Home() {
  return <div>Homepage</div>;
}

export default Home;
