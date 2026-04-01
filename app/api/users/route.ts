import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { userSchema } from '@/lib/schemas/entries';
import { isAdmin } from '@/lib/permissions';
import { writeAuditLog } from '@/server/services/audit.service';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) throw new Error('FORBIDDEN');
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return ok({ items: users.map(({ passwordHash, ...item }) => item) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await getCurrentUser();
    if (!actor || !isAdmin(actor)) throw new Error('FORBIDDEN');

    const body = userSchema.parse(await request.json());
    const password = body.password || '12345678';
    const passwordHash = await hashPassword(password);

    const created = await prisma.user.create({
      data: {
        fullName: body.fullName,
        username: body.username,
        passwordHash,
        role: body.role,
        isActive: body.isActive
      }
    });

    await writeAuditLog({
      userId: actor.id,
      action: 'CREATE',
      module: 'users',
      recordId: created.id,
      newValueJson: { ...created, passwordHash: undefined }
    });

    const { passwordHash: _, ...result } = created;
    return ok({ item: result });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const actor = await getCurrentUser();
    if (!actor || !isAdmin(actor)) throw new Error('FORBIDDEN');

    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new Error('Thiếu id user');

    const body = userSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new Error('Không tìm thấy user');

    const updated = await prisma.user.update({
      where: { id },
      data: {
        fullName: body.fullName,
        username: body.username,
        role: body.role,
        isActive: body.isActive,
        ...(body.password ? { passwordHash: await hashPassword(body.password) } : {})
      }
    });

    await writeAuditLog({
      userId: actor.id,
      action: 'UPDATE',
      module: 'users',
      recordId: updated.id,
      oldValueJson: { ...existing, passwordHash: undefined },
      newValueJson: { ...updated, passwordHash: undefined }
    });

    const { passwordHash: _, ...result } = updated;
    return ok({ item: result });
  } catch (error) {
    return handleApiError(error);
  }
}
