import { NextResponse } from 'next/server';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') return fail('Bạn chưa đăng nhập', 401);
    if (error.message === 'FORBIDDEN') return fail('Bạn không có quyền thực hiện thao tác này', 403);
    return fail(error.message || 'Có lỗi xảy ra', 400);
  }
  return fail('Có lỗi không xác định', 500);
}
