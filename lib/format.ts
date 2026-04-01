import { format } from 'date-fns';

export function formatDate(date: Date | string) {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function formatDecimal(value: number, digits = 2) {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  }).format(value);
}
