import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { isAdmin } from '@/lib/permissions';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) throw new Error('FORBIDDEN');

    const params = new URL(request.url).searchParams;
    const module = params.get('module');
    const items = await prisma.auditLog.findMany({
      where: module ? { module } : undefined,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    return ok({
      items: items.map((item) => ({
        ...item,
        user: { id: item.user.id, fullName: item.user.fullName, username: item.user.username }
      }))
    });
  } catch (error) {
    return handleApiError(error);
  }
}
