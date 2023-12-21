import { redirect, type LoaderFunctionArgs } from '@remix-run/node';

export function loader({ context: { session } }: LoaderFunctionArgs) {
  if (!session.has('accessToken')) {
    throw redirect('/login');
  }
  throw redirect('/home');
}
