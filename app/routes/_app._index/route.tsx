import i18next from '@lib/i18n/index.server';
import { authenticate } from '@lib/utils/auth.server';
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  if (!(await authenticate(session))) {
    session.unset('accessToken');
    session.unset('refreshToken');
    throw redirect('/login');
  }

  const title = await i18next
    .getFixedT(request, 'home')
    .then((x) => x('meta.title'));
  return json({ title });
}

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title: title }];
};

function Home() {
  return <div>Homepage</div>;
}

export default Home;
