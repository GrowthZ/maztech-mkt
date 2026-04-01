import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/auth';
import { ok } from '@/lib/api-response';

export async function POST() {
  cookies().delete(AUTH_COOKIE);
  return ok({ success: true });
}
