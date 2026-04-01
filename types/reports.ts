export type ContentSummaryRow = {
  ownerName: 'NAM' | 'DUC';
  image: number;
  video: number;
  total: number;
  seo: number;
};

export type FanpageRow = {
  fanpage: string;
  image: number;
  video: number;
  total: number;
};

export type SeoRow = {
  website: string;
  ownerName: 'NAM' | 'DUC';
  quantity: number;
};

export type AdsTotals = {
  spend: number;
  messages: number;
  data: number;
  costPerMessage: number;
  costPerData: number;
};

export type AdsByBrandRow = {
  brand: 'WINHOME' | 'SIEU_THI_KE_GIA';
  spend: number;
  messages: number;
  data: number;
  costPerMessage: number;
  costPerData: number;
};

export type DataTotals = {
  total: number;
  winhome: number;
  sieuThiKeGia: number;
};

export type DailyDataRow = {
  date: string;
  WINHOME: number;
  SIEU_THI_KE_GIA: number;
  total: number;
};

export type SourceRow = {
  source: string;
  WINHOME: number;
  SIEU_THI_KE_GIA: number;
  total: number;
};

export type BrandPerformanceRow = {
  brand: 'WINHOME' | 'SIEU_THI_KE_GIA';
  content: number;
  seo: number;
  data: number;
  spend: number;
};

export type ActivityRow = {
  id: string;
  time: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SEED';
  module: string;
  recordId: string;
};

export type DashboardSummaryData = {
  nam: ContentSummaryRow;
  duc: ContentSummaryRow;
  thien: AdsTotals;
  phuong: DataTotals;
};

export type AllReportsData = {
  dashboard: DashboardSummaryData;
  content: ContentSummaryRow[];
  fanpage: FanpageRow[];
  seo: SeoRow[];
  ads: AdsTotals;
  adsByBrand: AdsByBrandRow[];
  data: DataTotals;
  source: SourceRow[];
  trend: DailyDataRow[];
  dailyRows: DailyDataRow[];
  brandPerformance: BrandPerformanceRow[];
};
