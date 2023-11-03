export function searchParams(
  request: Request,
  defaultValues: Record<string, string>
) {
  const index = request.url.indexOf('?');
  const searchParams =
    index === -1
      ? new URLSearchParams()
      : new URLSearchParams(request.url.substring(index));
  searchParams.delete('_data');
  for (const key of searchParams.keys()) {
    if (!searchParams.get(key)) {
      searchParams.delete(key);
    }
  }
  return withDefault(searchParams, defaultValues);
}

export function pageable(searchParams: URLSearchParams) {
  return withDefault(searchParams, { page: '0', size: '10' });
}

export function withDefault(
  searchParams: URLSearchParams,
  defaultValues: Record<string, string>
) {
  for (const [k, v] of Object.entries(defaultValues)) {
    if (!searchParams.has(k)) {
      searchParams.set(k, v);
    }
  }
  return searchParams;
}
