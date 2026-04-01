import type { SearchParams } from '@/types';

export function searchParamsToUrl(searchParams: SearchParams) {
  const params = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(searchParams)) {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}
