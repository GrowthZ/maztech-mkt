import { cookies } from 'next/headers';
import { loginSchema } from '@/lib/schemas/auth';
import { handleApiError, ok } from '@/lib/api-response';
import { AUTH_COOKIE, loginWithUsername, signAuthToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = loginSchema.parse(body);
    const user = await loginWithUsername(payload.username, payload.password);
    if (!user) {
      throw new Error('Sai tài khoản hoặc mật khẩu');
    }

    const token = await signAuthToken(user);
    cookies().set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return ok({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
