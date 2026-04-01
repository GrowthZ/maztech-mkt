import { endOfMonth, endOfQuarter, endOfYear, parse, parseISO, startOfDay, startOfMonth, startOfQuarter, startOfYear, endOfDay } from 'date-fns';
import type { SearchParams } from '@/types';

export type ResolvedFilters = {
  mode: 'month' | 'quarter' | 'year' | 'custom';
  from: Date;
  to: Date;
  month?: string;
  quarter?: string;
  year?: string;
  brand?: string;
  owner?: string;
  source?: string;
};

function readString(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function resolveFilters(searchParams: SearchParams): ResolvedFilters {
  const mode = (readString(searchParams.mode) || 'month') as ResolvedFilters['mode'];
  const month = readString(searchParams.month);
  const quarter = readString(searchParams.quarter);
  const year = readString(searchParams.year);
  const fromParam = readString(searchParams.from);
  const toParam = readString(searchParams.to);
  const brand = readString(searchParams.brand);
  const owner = readString(searchParams.owner);
  const source = readString(searchParams.source);

  const now = new Date();

  if (mode === 'custom' && fromParam && toParam) {
    return {
      mode,
      from: startOfDay(parseISO(fromParam)),
      to: endOfDay(parseISO(toParam)),
      brand,
      owner,
      source
    };
  }

  if (mode === 'quarter' && quarter) {
    const [yearPart, quarterPart] = quarter.split('-Q');
    const base = parse(`${yearPart}-${(Number(quarterPart) - 1) * 3 + 1}-01`, 'yyyy-M-dd', new Date());
    return {
      mode,
      quarter,
      from: startOfQuarter(base),
      to: endOfQuarter(base),
      brand,
      owner,
      source
    };
  }

  if (mode === 'year' && year) {
    const base = parse(year, 'yyyy', new Date());
    return {
      mode,
      year,
      from: startOfYear(base),
      to: endOfYear(base),
      brand,
      owner,
      source
    };
  }

  const baseMonth = month ? parse(`${month}-01`, 'yyyy-MM-dd', new Date()) : now;
  return {
    mode: 'month',
    month: month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    from: startOfMonth(baseMonth),
    to: endOfMonth(baseMonth),
    brand,
    owner,
    source
  };
}
