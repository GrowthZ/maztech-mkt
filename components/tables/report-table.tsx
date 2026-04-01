import { Card, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';

export function ReportTable({
  title,
  columns,
  rows
}: {
  title: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, string | number | null | undefined>>;
}) {
  return (
    <Card>
      <CardTitle className="mb-4">{title}</CardTitle>
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                {columns.map((column) => <TH key={column.key}>{column.label}</TH>)}
              </TR>
            </THead>
            <TBody>
              {rows.map((row, index) => (
                <TR key={index}>
                  {columns.map((column) => <TD key={column.key}>{String(row[column.key] ?? '')}</TD>)}
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
