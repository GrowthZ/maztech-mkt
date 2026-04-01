import { getCurrentUser } from '@/lib/auth';
import { fail, ok } from '@/lib/api-response';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail('Bạn chưa đăng nhập', 401);
  return ok({ user });
}
