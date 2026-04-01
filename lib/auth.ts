import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import type { JwtUser } from '@/types';

export const AUTH_COOKIE = 'maztech_mkt_token';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET chưa được cấu hình');
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signAuthToken(user: JwtUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as unknown as JwtUser;
}

export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = await verifyAuthToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) {
      return null;
    }
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role
    } satisfies JwtUser;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function loginWithUsername(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.isActive) {
    return null;
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role
  } satisfies JwtUser;
}
