/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

import type { Session } from '@remix-run/node';
import type { UIMatch as UIMatch } from '@remix-run/react';
import type { ReactNode } from 'react';

declare global {
  interface SessionData {
    accessToken: string;
    refreshToken: string;
  }

  interface RouteHandle {
    i18n?: string | string[];
    breadcrumb?: (match?: UIMatch<unknown, RouteHandle>) => ReactNode;
  }
}

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    session: Session<SessionData, unknown>;
  }
}

declare module '@remix-run/react' {
  export function useMatches(): UIMatch<unknown, RouteHandle>[];
}
