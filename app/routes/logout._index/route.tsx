import { SessionApiClient } from '@lib/services/session-api-client.server';
import { destroySession } from '@lib/services/session.server';
import { redirect, type ActionFunctionArgs } from '@remix-run/node';

export async function action({ context: { session } }: ActionFunctionArgs) {
  if (!session) {
    return redirect('/login');
  }

  const refreshToken = session.get('refreshToken');
  if (refreshToken) {
    await SessionApiClient.from(session).delete(`auth/refresh-tokens/${refreshToken}`);
  }
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
