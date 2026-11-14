import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from './jwt.js';
import { unauthorized, forbidden } from '../utils/apiResponse.js';
import { connectDB } from '../db.js';
import User from '../models/User.js';

/**
 * Read and verify the JWT from the request.
 * Returns the user document or null.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) return null;

    return user;
  } catch {
    return null;
  }
}

/**
 * Require any authenticated user.
 * Returns { user } on success, or { error: NextResponse } to short-circuit.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: unauthorized('Authentication required') };
  }
  return { user };
}

/**
 * Require one of the given roles.
 * Returns { user } on success, or { error: NextResponse }.
 */
export async function requireRole(...allowedRoles) {
  const result = await requireAuth();
  if (result.error) return result;

  const { user } = result;
  if (!allowedRoles.includes(user.role)) {
    return {
      error: forbidden(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`
      ),
    };
  }
  return { user };
}