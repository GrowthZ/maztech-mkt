import { BRAND_OPTIONS, CONTENT_TYPE_OPTIONS, DATA_SOURCE_OPTIONS, MODULE_LABELS, OWNER_OPTIONS, ROLE_LABELS, WEBSITE_BRAND_MAP } from '@/lib/constants';

function lookupLabel(options: ReadonlyArray<{ value: string; label: string }>, value: string) {
  return options.find((option) => option.value === value)?.label || value;
}

export function formatBrandLabel(value: string) {
  return lookupLabel(BRAND_OPTIONS, value);
}

export function formatOwnerLabel(value: string) {
  return lookupLabel(OWNER_OPTIONS, value);
}

export function formatContentTypeLabel(value: string) {
  return lookupLabel(CONTENT_TYPE_OPTIONS, value);
}

export function formatDataSourceLabel(value: string) {
  return lookupLabel(DATA_SOURCE_OPTIONS, value);
}

export function formatRoleLabel(value: string) {
  return ROLE_LABELS[value] || value;
}

export function formatModuleLabel(value: string) {
  return MODULE_LABELS[value] || value;
}

export function percentWidth(value: number, total: number) {
  if (total <= 0) return '0%';
  return `${Math.min(100, Math.round((value / total) * 100))}%`;
}

export function getBrandFromWebsite(website: string): 'WINHOME' | 'SIEU_THI_KE_GIA' | null {
  const normalized = website.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  const direct = WEBSITE_BRAND_MAP[normalized as keyof typeof WEBSITE_BRAND_MAP];
  if (direct) return direct;
  if (normalized.includes('winhome')) return 'WINHOME';
  if (normalized.includes('kegia')) return 'SIEU_THI_KE_GIA';
  return null;
}
