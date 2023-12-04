/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

import type { Session } from '@remix-run/node';
import type { UIMatch as UIMatch } from '@remix-run/react';
import type { TFunction } from 'i18next';

declare global {
  type RequiredProps<T, P extends keyof NonNullable<T>> = Omit<T, P> & Required<Pick<NonNullable<T>, P>>;
  interface SessionData {
    accessToken: string;
    refreshToken: string;
  }

  interface RouteData {
    title?: string;
  }

  interface RouteHandle {
    i18n?: string | string[];
    breadcrumb?: true;
  }

  interface BreadcrumbContext {
    match: UIMatch<unknown, RouteHandle>;
    t: TFunction<'meta', undefined>;
  }
}

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    session: Session<SessionData, unknown>;
  }
}

declare module '@remix-run/react' {
  export function useMatches(): UIMatch<RouteData | unknown, RouteHandle | unknown>[];
}
