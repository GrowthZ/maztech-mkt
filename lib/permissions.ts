import type { JwtUser } from '@/types';

export type ModuleName = 'content' | 'seo' | 'ads' | 'data' | 'users' | 'audit';

export function ownerNameFromUsername(username: string): 'NAM' | 'DUC' | null {
  return ownerNameFromIdentity(username);
}

function normalize(value?: string) {
  return (value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function hasIdentityToken(value: string | undefined, token: string) {
  const normalizedValue = normalize(value);
  if (!normalizedValue) return false;
  return normalizedValue === token || normalizedValue.startsWith(`${token}.`) || normalizedValue.includes(token);
}

function resolveIdentity(username: string | undefined, fullName?: string) {
  if (hasIdentityToken(username, 'nam') || hasIdentityToken(fullName, 'nam')) return 'nam';
  if (hasIdentityToken(username, 'duc') || hasIdentityToken(fullName, 'duc')) return 'duc';
  if (hasIdentityToken(username, 'thien') || hasIdentityToken(fullName, 'thien')) return 'thien';
  if (hasIdentityToken(username, 'phuong') || hasIdentityToken(fullName, 'phuong')) return 'phuong';
  return null;
}

export function ownerNameFromIdentity(username: string | undefined, fullName?: string): 'NAM' | 'DUC' | null {
  const identity = resolveIdentity(username, fullName);
  if (identity === 'nam') return 'NAM';
  if (identity === 'duc') return 'DUC';
  return null;
}

export function isAdmin(user: JwtUser) {
  return user.role === 'ADMIN';
}

export function hasGlobalAccess(user: Pick<JwtUser, 'role'>) {
  return user.role === 'ADMIN';
}

export function canAccessModuleByIdentity(role: string | undefined, username: string | undefined, module: ModuleName, fullName?: string) {
  if (role === 'ADMIN') return true;

  const identity = resolveIdentity(username, fullName);
  if (module === 'content' || module === 'seo') {
    return role === 'CONTENT' && (identity === 'nam' || identity === 'duc');
  }

  if (module === 'ads') {
    return role === 'ADS' && identity === 'thien';
  }

  if (module === 'data') {
    return role === 'DATA_INPUT' && identity === 'phuong';
  }

  return false;
}

export function canAccessModule(user: JwtUser, module: ModuleName) {
  return canAccessModuleByIdentity(user.role, user.username, module, user.fullName);
}

export function assertModuleAccess(user: JwtUser, module: ModuleName) {
  if (!canAccessModule(user, module)) {
    throw new Error('FORBIDDEN');
  }
}

export function assertOwnerMatch(user: JwtUser, ownerName: string) {
  if (hasGlobalAccess(user)) return;
  const owner = ownerNameFromIdentity(user.username, user.fullName);
  if (!owner || owner !== ownerName) {
    throw new Error('FORBIDDEN');
  }
}

export function assertRecordCreator(user: JwtUser, createdById: string) {
  if (!isAdmin(user) && user.id !== createdById) {
    throw new Error('FORBIDDEN');
  }
}
