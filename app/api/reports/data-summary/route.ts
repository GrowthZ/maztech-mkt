import { getCurrentUser } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { resolveFilters } from '@/lib/filters';
import { dailyDataRows, dailyDataTrend, phuongTotals } from '@/server/reports';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    const filters = resolveFilters(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const [totals, trend, rows] = await Promise.all([phuongTotals(filters, user), dailyDataTrend(filters, user), dailyDataRows(filters, user)]);
    return ok({ totals, trend, rows });
  } catch (error) {
    return handleApiError(error);
  }
}
