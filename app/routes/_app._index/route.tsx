import i18next from '@lib/i18n/index.server';
import { authenticate } from '@lib/utils/auth.server';
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';

export function handle() {
  return { i18n: ['meta', 'home'] };
}

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title }];
};

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
    .getFixedT(request, 'meta')
    .then((x) => x('home.title'));
  return json({ title });
}

function Home() {
  return <div>Homepage</div>;
}

export default Home;
