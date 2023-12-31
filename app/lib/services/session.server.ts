if (!process.env.COOKIE_SECRET) {
  throw new ReferenceError(
    'COOKIE_SECRET environment variable must be provided'
  );
}

import { createCookieSessionStorage } from '@remix-run/node';

const {
  getSession: __getSession,
  commitSession,
  destroySession,
} = createCookieSessionStorage<SessionData, unknown>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.COOKIE_SECRET],
    secure: true,
  },
});

export function getSession(request: Request) {
  return __getSession(request.headers.get('Cookie'));
}

export { commitSession, destroySession };
