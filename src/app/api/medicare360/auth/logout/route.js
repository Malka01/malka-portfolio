import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/medicare360/auth/jwt';
import { ok } from '@/lib/medicare360/utils/apiResponse';

/**
 * POST /api/medicare360/auth/logout
 *
 * Clears the auth cookie. No server-side session to revoke since
 * we use stateless JWTs.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return ok({}, 'Logged out');
}