import type { ResolvedFilters } from '@/lib/filters';
import type { Prisma } from '@prisma/client';
import type { JwtUser } from '@/types';
import { isAdmin, ownerNameFromUsername } from '@/lib/permissions';

export function dateWhere(filters: ResolvedFilters) {
  return {
    gte: filters.from,
    lte: filters.to
  };
}

export function scopedContentWhere(filters: ResolvedFilters, user: JwtUser): Prisma.ContentEntryWhereInput {
  const ownerName = ownerNameFromUsername(user.username);

  return {
    date: dateWhere(filters),
    ...(filters.brand ? { brand: filters.brand as never } : {}),
    ...(filters.owner ? { ownerName: filters.owner as never } : {}),
    ...(!isAdmin(user)
      ? {
          ...(ownerName ? { ownerName: ownerName as never } : {}),
          createdById: user.id
        }
      : {})
  };
}

export function scopedSeoWhere(filters: ResolvedFilters, user: JwtUser): Prisma.SeoEntryWhereInput {
  const ownerName = ownerNameFromUsername(user.username);

  return {
    date: dateWhere(filters),
    ...(filters.owner ? { ownerName: filters.owner as never } : {}),
    ...(!isAdmin(user)
      ? {
          ...(ownerName ? { ownerName: ownerName as never } : {}),
          createdById: user.id
        }
      : {})
  };
}

export function scopedAdsWhere(filters: ResolvedFilters, user: JwtUser): Prisma.AdsEntryWhereInput {
  return {
    date: dateWhere(filters),
    ...(filters.brand ? { brand: filters.brand as never } : {}),
    ...(!isAdmin(user) ? { createdById: user.id } : {})
  };
}

export function scopedDataWhere(filters: ResolvedFilters, user: JwtUser): Prisma.DataEntryWhereInput {
  return {
    date: dateWhere(filters),
    ...(filters.brand ? { brand: filters.brand as never } : {}),
    ...(filters.source ? { source: filters.source as never } : {}),
    ...(!isAdmin(user) ? { createdById: user.id } : {})
  };
}
