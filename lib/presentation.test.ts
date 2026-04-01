import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBrandLabel, formatDataSourceLabel, getBrandFromWebsite, percentWidth } from './presentation';

test('formatBrandLabel returns Vietnamese label', () => {
  assert.equal(formatBrandLabel('WINHOME'), 'Winhome');
  assert.equal(formatBrandLabel('SIEU_THI_KE_GIA'), 'Siêu Thị Kệ Giá');
});

test('formatDataSourceLabel resolves enum names', () => {
  assert.equal(formatDataSourceLabel('FACEBOOK'), 'Facebook');
  assert.equal(formatDataSourceLabel('WEBSITE'), 'Website');
});

test('getBrandFromWebsite resolves known domains', () => {
  assert.equal(getBrandFromWebsite('nhadidongwinhome.com'), 'WINHOME');
  assert.equal(getBrandFromWebsite('https://www.sieuthikegia.com/'), 'SIEU_THI_KE_GIA');
  assert.equal(getBrandFromWebsite('unknown-domain.com'), null);
});

test('percentWidth clamps and handles zero safely', () => {
  assert.equal(percentWidth(50, 200), '25%');
  assert.equal(percentWidth(10, 0), '0%');
  assert.equal(percentWidth(300, 200), '100%');
});
