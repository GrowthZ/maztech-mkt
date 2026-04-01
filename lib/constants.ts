export const BRAND_OPTIONS = [
  { value: 'WINHOME', label: 'Winhome' },
  { value: 'SIEU_THI_KE_GIA', label: 'Siêu Thị Kệ Giá' }
] as const;

export const CONTENT_TYPE_OPTIONS = [
  { value: 'IMAGE', label: 'Ảnh' },
  { value: 'VIDEO', label: 'Video' }
] as const;

export const DATA_SOURCE_OPTIONS = [
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'HOTLINE', label: 'Hotline' },
  { value: 'ZALO', label: 'Zalo' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'WEBSITE', label: 'Website' }
] as const;

export const OWNER_OPTIONS = [
  { value: 'NAM', label: 'Nam' },
  { value: 'DUC', label: 'Đức' }
] as const;

export const FANPAGE_OPTIONS = [
  { value: 'Winhome Fanpage Chính', label: 'Winhome Fanpage Chính' },
  { value: 'Winhome Miền Nam', label: 'Winhome Miền Nam' },
  { value: 'Siêu Thị Kệ Giá', label: 'Siêu Thị Kệ Giá' }
] as const;

export const WEBSITE_OPTIONS = [
  { value: 'nhadidongwinhome.com', label: 'nhadidongwinhome.com' },
  { value: 'sieuthikegia.com', label: 'sieuthikegia.com' }
] as const;

export const WEBSITE_BRAND_MAP = {
  'nhadidongwinhome.com': 'WINHOME',
  'sieuthikegia.com': 'SIEU_THI_KE_GIA'
} as const;

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  CONTENT: 'Content',
  ADS: 'Ads',
  DATA_INPUT: 'Nhập data'
};

export const MODULE_LABELS: Record<string, string> = {
  content_entries: 'Social',
  seo_entries: 'SEO',
  ads_entries: 'Ads',
  data_entries: 'Data đầu vào',
  users: 'Người dùng',
  SYSTEM: 'Hệ thống'
};

export const DEFAULT_MONTH = new Date().toISOString().slice(0, 7);
