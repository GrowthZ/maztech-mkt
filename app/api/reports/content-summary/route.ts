import { getCurrentUser } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { resolveFilters } from '@/lib/filters';
import { contentSummaryByOwner } from '@/server/reports';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    const filters = resolveFilters(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const data = await contentSummaryByOwner(filters, user);
    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}
