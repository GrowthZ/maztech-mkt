export type SearchParams = Record<string, string | string[] | undefined>;

export type JwtUser = {
  id: string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'CONTENT' | 'ADS' | 'DATA_INPUT';
};

export type ReportMode = 'month' | 'quarter' | 'year' | 'custom';
