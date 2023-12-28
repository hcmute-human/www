export function searchParams(request: Request, defaultValues?: Record<string, string>) {
  const index = request.url.indexOf('?');
  const searchParams = index === -1 ? new URLSearchParams() : new URLSearchParams(request.url.substring(index));
  searchParams.delete('_data');
  for (const key of searchParams.keys()) {
    if (!searchParams.get(key)) {
      searchParams.delete(key);
    }
  }
  return defaultValues ? withDefault(searchParams, defaultValues) : searchParams;
}

export function pageable(searchParams: URLSearchParams) {
  return withDefault(searchParams, { page: '0', size: '10' });
}

export function withDefault(searchParams: URLSearchParams, defaultValues: Record<string, string>) {
  for (const [k, v] of Object.entries(defaultValues)) {
    if (!searchParams.has(k)) {
      searchParams.set(k, v);
    }
  }
  return searchParams;
}

export function toRecord(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams.entries()) as Record<string, string | undefined>;
}

export function searchParamsRecord(request: Request) {
  const index = request.url.indexOf('?');
  const search = index === -1 ? '' : request.url.substring(index + 1);
  return search.split('&').reduce<Record<string, string>>((acc, cur) => {
    const index = cur.indexOf('=');
    if (index === -1) {
      return acc;
    }
    acc[cur.substring(0, index)] = cur.substring(index + 1);
    return acc;
  }, {});
}
