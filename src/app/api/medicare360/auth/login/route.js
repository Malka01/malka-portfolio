import { cookies } from 'next/headers';
import { connectDB } from '@/lib/medicare360/db';
import User from '@/lib/medicare360/models/User';
import { verifyPassword } from '@/lib/medicare360/auth/password';
import { signToken, COOKIE_NAME, cookieOptions } from '@/lib/medicare360/auth/jwt';
import {
  ok,
  badRequest,
  unauthorized,
  serverError,
} from '@/lib/medicare360/utils/apiResponse';
import { logger } from '@/lib/medicare360/utils/logger';

/**
 * POST /api/medicare360/auth/login
 *
 * Rate limiting is NOT implemented in Phase 2. Add it in Phase 13
 * using an in-memory or Redis-backed limiter.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return badRequest('Email and password are required');
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+passwordHash'
    );

    // Use the same generic message for "user not found" and "wrong password"
    // to prevent account enumeration.
    if (!user || !user.isActive) {
      return unauthorized('Invalid credentials');
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return unauthorized('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({ userId: user._id.toString(), role: user.role });
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, cookieOptions);

    logger.info('User logged in', { email: user.email, role: user.role });

    return ok(
      {
        user: user.toJSON(),
        token,
      },
      'Login successful'
    );
  } catch (err) {
    logger.error('Login error', { err: err.message });
    return serverError('Could not complete login');
  }
}