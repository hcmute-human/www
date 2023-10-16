import { SessionApiClient } from '@lib/services/session-api-client.server';
import type { Session } from '@remix-run/node';

interface AuthorizeRequest {
  permissions: string[];
  allPermission?: boolean;
}

export async function authenticate(session: Session<SessionData, unknown>) {
  return await SessionApiClient.from(session).authenticate();
}

export async function authorize(
  session: Session<SessionData, unknown>,
  body: AuthorizeRequest = { permissions: [] }
) {
  return await SessionApiClient.from(session).authorize(body);
}
