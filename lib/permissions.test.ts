import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessModuleByIdentity, hasGlobalAccess, ownerNameFromIdentity } from './permissions';

test('admin has global access', () => {
  assert.equal(hasGlobalAccess({ role: 'ADMIN' }), true);
  assert.equal(canAccessModuleByIdentity('ADMIN', 'anything', 'content', 'Admin Maztech'), true);
  assert.equal(canAccessModuleByIdentity('ADMIN', 'anything', 'ads', 'Admin Maztech'), true);
  assert.equal(canAccessModuleByIdentity('ADMIN', 'anything', 'data', 'Admin Maztech'), true);
});

test('content and seo identity resolves by username or full name', () => {
  assert.equal(ownerNameFromIdentity('duc', 'Đức'), 'DUC');
  assert.equal(ownerNameFromIdentity('nguyen duc', 'Đức Nguyễn'), 'DUC');
  assert.equal(ownerNameFromIdentity('nam', 'Nam'), 'NAM');
});

test('only assigned roles can access the expected modules', () => {
  assert.equal(canAccessModuleByIdentity('CONTENT', 'nam', 'content', 'Nam'), true);
  assert.equal(canAccessModuleByIdentity('CONTENT', 'duc', 'seo', 'Đức'), true);
  assert.equal(canAccessModuleByIdentity('ADS', 'thien', 'ads', 'Thiên'), true);
  assert.equal(canAccessModuleByIdentity('DATA_INPUT', 'phuong', 'data', 'Phượng'), true);
  assert.equal(canAccessModuleByIdentity('CONTENT', 'thien', 'content', 'Thiên'), false);
  assert.equal(canAccessModuleByIdentity('ADS', 'phuong', 'ads', 'Phượng'), false);
});
