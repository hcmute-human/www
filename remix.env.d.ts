/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

import type { Session } from '@remix-run/node';

declare global {
  interface SessionData {
    accessToken: string;
    refreshToken: string;
  }
}

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    session: Session<SessionData, unknown>;
  }
}
