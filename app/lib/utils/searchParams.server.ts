export function searchParams(request: Request) {
  const searchParams = new URLSearchParams(new URL(request.url).search);
  searchParams.delete('_data');
  for (const key of searchParams.keys()) {
    if (!searchParams.get(key)) {
      searchParams.delete(key);
    }
  }
  return searchParams;
}

export function pageable(searchParams: URLSearchParams) {
  searchParams.set('page', (Number(searchParams.get('page')) || 0) + '');
  searchParams.set('size', (Number(searchParams.get('size')) || 10) + '');
  return searchParams;
}

export function filterable(searchParams: URLSearchParams, ...names: string[]) {
  for (const name of names) {
    const value = searchParams.get(name);
    if (value) {
      searchParams.set(name, value);
    }
  }
  return searchParams;
}
