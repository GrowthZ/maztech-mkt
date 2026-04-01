import { getCurrentUser } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { resolveFilters } from '@/lib/filters';
import { adsBreakdownByBrand, adsTotals } from '@/server/reports';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    const filters = resolveFilters(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const [totals, byBrand] = await Promise.all([adsTotals(filters, user), adsBreakdownByBrand(filters, user)]);
    return ok({ totals, byBrand });
  } catch (error) {
    return handleApiError(error);
  }
}
