import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

function asJson(value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function writeAuditLog(params: {
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SEED';
  module: string;
  recordId: string;
  oldValueJson?: unknown;
  newValueJson?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      module: params.module,
      recordId: params.recordId,
      oldValueJson: asJson(params.oldValueJson),
      newValueJson: asJson(params.newValueJson)
    }
  });
}
