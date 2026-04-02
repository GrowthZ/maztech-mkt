import type { JwtUser } from '@/types';

export type ModuleName = 'content' | 'seo' | 'ads' | 'data' | 'users' | 'audit';

export function ownerNameFromUsername(username: string): 'NAM' | 'DUC' | null {
  if (username === 'nam') return 'NAM';
  if (username === 'duc') return 'DUC';
  return null;
}

export function isAdmin(user: JwtUser) {
  return user.role === 'ADMIN';
}

function normalized(username?: string) {
  return (username || '').trim().toLowerCase();
}

export function canAccessModuleByIdentity(role: string | undefined, username: string | undefined, module: ModuleName) {
  if (role === 'ADMIN') return true;

  const user = normalized(username);
  if (module === 'content' || module === 'seo') {
    return role === 'CONTENT' && (user === 'nam' || user === 'duc');
  }

  if (module === 'ads') {
    return role === 'ADS' && user === 'thien';
  }

  if (module === 'data') {
    return role === 'DATA_INPUT' && user === 'phuong';
  }

  return false;
}

export function canAccessModule(user: JwtUser, module: ModuleName) {
  return canAccessModuleByIdentity(user.role, user.username, module);
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
