import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/auth';
import { ok } from '@/lib/api-response';

export async function POST() {
  cookies().set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  return ok({ success: true });
}

export async function GET() {
  return POST();
}
