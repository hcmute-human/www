export function paginated<T>(): Paginated<T>;
export function paginated<T>(totalCount: number): Paginated<T>;
export function paginated<T>(totalCount: number, items: T[]): Paginated<T>;
export function paginated<T>(totalCount?: number, items?: T[]) {
  return { totalCount: totalCount ?? 0, items: items ?? [] };
}

export interface Paginated<T> {
  totalCount: number;
  items: T[];
}
