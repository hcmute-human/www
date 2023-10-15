import { commitSession, getSession } from '@lib/services/session.server';
import { authenticate } from '@lib/utils/auth.server';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);

  if (!(await authenticate(session))) {
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
  return json(null, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

function Home() {
  return <div>Home</div>;
}

export default Home;
