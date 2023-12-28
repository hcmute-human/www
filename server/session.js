if (!process.env.COOKIE_SECRET) {
  throw new ReferenceError('COOKIE_SECRET environment variable must be provided');
}

import { createCookieSessionStorage } from '@remix-run/node';
import { jwtDecode } from 'jwt-decode';

export const sessionStorage = createCookieSessionStorage({
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

export function WrappedSession(session) {
  return {
    ...session,
    dirty: false,
    set(name, value) {
      session.set(name, value);
      this.dirty = true;
    },
    flash(name, value) {
      session.flash(name, value);
      this.dirty = true;
    },
    unset(name) {
      session.unset(name);
      this.dirty = true;
    },
    decode() {
      try {
        const payload = jwtDecode(session.get('accessToken'));
        payload.sub ??= payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        delete payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        return payload;
      } catch {
        return {};
      }
    },
  };
}
