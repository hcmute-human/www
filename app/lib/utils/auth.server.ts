import { SessionApiClient } from '@lib/services/session-api-client.server';
import type { SessionData } from '@lib/services/session.server';
import type { Session } from '@remix-run/node';

interface AuthorizeRequest {
  permissions: string[];
  allPermission?: boolean;
}

export async function authenticate(session: Session<SessionData, unknown>) {
  const result = await SessionApiClient.from(session).then((x) =>
    x.post('auth/authenticate', {
      method: 'post',
    })
  );
  return !result.isErr() && result.value.ok;
}

export async function authorize(
  session: Session<SessionData, unknown>,
  body: AuthorizeRequest = { permissions: [] }
) {
  const result = await SessionApiClient.from(session).then((x) =>
    x.post('auth/authorize', {
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
  return !result.isErr() && result.value.ok;
}
