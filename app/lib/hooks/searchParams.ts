import { useSearchParams } from '@remix-run/react';

export function useSearchParamsOr<T extends Record<string, string | number>>(
  defaultValue: T
) {
  const [searchParams] = useSearchParams();
  const object = {} as T;
  type Key = keyof T;
  type Value = T[Key];
  for (const [k, v] of Object.entries(defaultValue)) {
    const value = searchParams.get(k);
    if (!value) {
      object[k as Key] = v as Value;
      continue;
    }
    switch (typeof v) {
      case 'string': {
        object[k as Key] = value as Value;
        break;
      }
      case 'number': {
        const number = Number(value);
        if (!isNaN(number)) {
          object[k as Key] = number as Value;
        }
      }
    }
  }
  return [object, searchParams] as const;
}

export function usePagination(
  additionalValues?: Record<string, string | number>
) {
  return useSearchParamsOr({
    page: 1,
    size: 10,
    ...additionalValues,
  });
}
