import { buildTitle } from '@lib/utils';
import { authenticate } from '@lib/utils/auth.server';
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';

export async function loader({ context: { session } }: LoaderFunctionArgs) {
  if (!(await authenticate(session))) {
    session.unset('accessToken');
    session.unset('refreshToken');
    throw redirect('/login');
  }
  return json(null);
}

export const meta: MetaFunction<typeof loader> = ({ matches }) =>
  buildTitle(matches);

function Home() {
  return <div>Homepage</div>;
}

export default Home;
