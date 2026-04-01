'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/http';
import { Card, CardTitle } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { formatDate } from '@/lib/format';

type AuditLogRow = {
  id: string;
  createdAt: string;
  action: string;
  module: string;
  recordId: string;
  user: { fullName: string };
};

export function AuditLogsTable() {
  const query = useQuery({ queryKey: ['audit-logs'], queryFn: () => apiFetch<{ items: AuditLogRow[] }>('/api/audit-logs') });
  return <Card><CardTitle className="mb-4">Nhật ký thao tác</CardTitle><div className="overflow-x-auto"><Table><THead><TR><TH>Thời gian</TH><TH>Người thao tác</TH><TH>Action</TH><TH>Module</TH><TH>Record ID</TH></TR></THead><TBody>{query.data?.items.map((item) => <TR key={item.id}><TD>{formatDate(item.createdAt)}</TD><TD>{item.user.fullName}</TD><TD>{item.action}</TD><TD>{item.module}</TD><TD>{item.recordId}</TD></TR>)}</TBody></Table></div></Card>;
}
