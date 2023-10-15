import { authenticate } from '@lib/utils/auth.server';
import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ context: { session } }: LoaderFunctionArgs) {
  if (!(await authenticate(session))) {
    session.unset('accessToken');
    session.unset('refreshToken');
    throw redirect('/login');
  }
  return json(null);
}

function Home() {
  return <div>Home</div>;
}

export default Home;
