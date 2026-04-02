import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { canAccessModuleByIdentity, type ModuleName } from '@/lib/permissions';

const AUTH_COOKIE = 'maztech_mkt_token';
const protectedPrefixes = ['/dashboard', '/input', '/reports', '/settings', '/audit-logs'];

function withNoStoreHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');
  return response;
}

async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET chưa cấu hình');
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload as { role?: string; username?: string; fullName?: string };
}

function inputModuleFromPath(pathname: string): ModuleName | null {
  if (pathname.startsWith('/input/content')) return 'content';
  if (pathname.startsWith('/input/seo')) return 'seo';
  if (pathname.startsWith('/input/ads')) return 'ads';
  if (pathname.startsWith('/input/data')) return 'data';
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = pathname === '/login';
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!isProtected && !isAuthPage && pathname !== '/') {
    return NextResponse.next();
  }

  if (!token) {
    if (isProtected || pathname === '/') {
      return withNoStoreHeaders(NextResponse.redirect(new URL('/login', request.url)));
    }
    return withNoStoreHeaders(NextResponse.next());
  }

  try {
    const payload = await verifyToken(token);

    if (pathname === '/') {
      return withNoStoreHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    if ((pathname.startsWith('/settings') || pathname.startsWith('/audit-logs')) && payload.role !== 'ADMIN') {
      return withNoStoreHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    const inputModule = inputModuleFromPath(pathname);
    if (inputModule && !canAccessModuleByIdentity(payload.role, payload.username, inputModule, payload.fullName)) {
      return withNoStoreHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    }

    return withNoStoreHeaders(NextResponse.next());
  } catch {
    const response = withNoStoreHeaders(NextResponse.redirect(new URL('/login', request.url)));
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/input/:path*', '/reports/:path*', '/settings/:path*', '/audit-logs/:path*']
};
