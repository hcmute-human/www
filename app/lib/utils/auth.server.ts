import { SessionApiClient } from '@lib/services/session-api-client.server';

interface AuthorizeRequest {
  permissions: string[];
  allPermission?: boolean;
}

export async function authenticate(request: Request) {
  const result = await SessionApiClient.from(request).then((x) =>
    x.post('auth/authenticate', {
      method: 'post',
    })
  );
  return !result.isErr() && result.value.ok;
}

export async function authorize(
  request: Request,
  body: AuthorizeRequest = { permissions: [] }
) {
  const result = await SessionApiClient.from(request).then((x) =>
    x.post('auth/authorize', {
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
  return !result.isErr() && result.value.ok;
}
