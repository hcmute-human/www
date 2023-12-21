declare global {
  type ActionError = Record<string, string[]>;
  type Either<T1, T2> = (T1 & { [key in keyof T2]?: never }) | (T2 & { [key in keyof T1]?: never });
}

declare namespace NodeJS {
  export interface ProcessEnv {
    API_BASE_URL?: string;
    API_ACCESS_TOKEN?: string;
    COOKIE_SECRET?: string;
    CLOUDINARY_CLOUD_NAME?: string;
  }
}

declare module 'tailwindcss-animated' {
  const plugin: { handler: () => void };
  export = plugin;
}

import { type FilterFn } from '@tanstack/table-core';
import { type RankingInfo } from '@tanstack/match-sorter-utils';
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzyFilter: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
