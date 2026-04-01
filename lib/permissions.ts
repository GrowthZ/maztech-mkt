import type { JwtUser } from '@/types';

type ModuleName = 'content' | 'seo' | 'ads' | 'data' | 'users' | 'audit';

export function ownerNameFromUsername(username: string): 'NAM' | 'DUC' | null {
  if (username === 'nam') return 'NAM';
  if (username === 'duc') return 'DUC';
  return null;
}

export function isAdmin(user: JwtUser) {
  return user.role === 'ADMIN';
}

export function canAccessModule(user: JwtUser, module: ModuleName) {
  if (user.role === 'ADMIN') return true;
  if (module === 'content' || module === 'seo') return user.role === 'CONTENT';
  if (module === 'ads') return user.role === 'ADS';
  if (module === 'data') return user.role === 'DATA_INPUT';
  return false;
}

export function assertModuleAccess(user: JwtUser, module: ModuleName) {
  if (!canAccessModule(user, module)) {
    throw new Error('FORBIDDEN');
  }
}

export function assertOwnerMatch(user: JwtUser, ownerName: string) {
  if (isAdmin(user)) return;
  const owner = ownerNameFromUsername(user.username);
  if (!owner || owner !== ownerName) {
    throw new Error('FORBIDDEN');
  }
}

export function assertRecordCreator(user: JwtUser, createdById: string) {
  if (!isAdmin(user) && user.id !== createdById) {
    throw new Error('FORBIDDEN');
  }
}
