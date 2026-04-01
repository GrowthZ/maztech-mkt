import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { adsEntrySchema } from '@/lib/schemas/entries';
import { assertModuleAccess, assertRecordCreator, isAdmin } from '@/lib/permissions';
import { resolveFilters } from '@/lib/filters';
import { scopedAdsWhere } from '@/server/services/common';
import { writeAuditLog } from '@/server/services/audit.service';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    assertModuleAccess(user, 'ads');

    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    const filters = resolveFilters(searchParams);
    const items = await prisma.adsEntry.findMany({
      where: scopedAdsWhere(filters, user),
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
    assertModuleAccess(user, 'ads');

    const body = adsEntrySchema.parse(await request.json());
    const created = await prisma.adsEntry.create({
      data: {
        ...body,
        date: new Date(body.date),
        createdById: user.id
      }
    });

    await writeAuditLog({ userId: user.id, action: 'CREATE', module: 'ads', recordId: created.id, newValueJson: created });
    return ok({ item: created });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    assertModuleAccess(user, 'ads');

    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new Error('Thiếu id bản ghi');
    const body = adsEntrySchema.parse(await request.json());
    const existing = await prisma.adsEntry.findUnique({ where: { id } });
    if (!existing) throw new Error('Không tìm thấy bản ghi');

    if (!isAdmin(user)) {
      assertRecordCreator(user, existing.createdById);
    }

    const updated = await prisma.adsEntry.update({
      where: { id },
      data: { ...body, date: new Date(body.date) }
    });

    await writeAuditLog({ userId: user.id, action: 'UPDATE', module: 'ads', recordId: updated.id, oldValueJson: existing, newValueJson: updated });
    return ok({ item: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    assertModuleAccess(user, 'ads');

    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new Error('Thiếu id bản ghi');
    const existing = await prisma.adsEntry.findUnique({ where: { id } });
    if (!existing) throw new Error('Không tìm thấy bản ghi');

    if (!isAdmin(user)) {
      assertRecordCreator(user, existing.createdById);
    }

    await prisma.adsEntry.delete({ where: { id } });
    await writeAuditLog({ userId: user.id, action: 'DELETE', module: 'ads', recordId: id, oldValueJson: existing });
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
