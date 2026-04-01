import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { contentEntrySchema } from '@/lib/schemas/entries';
import { assertModuleAccess, assertOwnerMatch, assertRecordCreator, isAdmin } from '@/lib/permissions';
import { resolveFilters } from '@/lib/filters';
import { scopedContentWhere } from '@/server/services/common';
import { writeAuditLog } from '@/server/services/audit.service';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    assertModuleAccess(user, 'content');

    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    const filters = resolveFilters(searchParams);
    const items = await prisma.contentEntry.findMany({
      where: scopedContentWhere(filters, user),
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }]
    });
    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    assertModuleAccess(user, 'content');

    const body = contentEntrySchema.parse(await request.json());
    if (!isAdmin(user)) {
      assertOwnerMatch(user, body.ownerName);
    }

    const created = await prisma.contentEntry.create({
      data: {
        ...body,
        date: new Date(body.date),
        createdById: user.id
      }
    });

    await writeAuditLog({ userId: user.id, action: 'CREATE', module: 'content', recordId: created.id, newValueJson: created });
    return ok({ item: created });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    assertModuleAccess(user, 'content');

    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new Error('Thiếu id bản ghi');

    const body = contentEntrySchema.parse(await request.json());
    const existing = await prisma.contentEntry.findUnique({ where: { id } });
    if (!existing) throw new Error('Không tìm thấy bản ghi');

    if (!isAdmin(user)) {
      assertRecordCreator(user, existing.createdById);
      assertOwnerMatch(user, existing.ownerName);
      assertOwnerMatch(user, body.ownerName);
    }

    const updated = await prisma.contentEntry.update({
      where: { id },
      data: { ...body, date: new Date(body.date) }
    });

    await writeAuditLog({ userId: user.id, action: 'UPDATE', module: 'content', recordId: updated.id, oldValueJson: existing, newValueJson: updated });
    return ok({ item: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    assertModuleAccess(user, 'content');

    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new Error('Thiếu id bản ghi');
    const existing = await prisma.contentEntry.findUnique({ where: { id } });
    if (!existing) throw new Error('Không tìm thấy bản ghi');

    if (!isAdmin(user)) {
      assertRecordCreator(user, existing.createdById);
      assertOwnerMatch(user, existing.ownerName);
    }

    await prisma.contentEntry.delete({ where: { id } });
    await writeAuditLog({ userId: user.id, action: 'DELETE', module: 'content', recordId: id, oldValueJson: existing });
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
