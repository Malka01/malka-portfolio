import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/medicare360/db';
import User, { ROLES } from '@/lib/medicare360/models/User';
import {
  hashPassword,
  validatePasswordStrength,
} from '@/lib/medicare360/auth/password';
import { signToken, COOKIE_NAME, cookieOptions } from '@/lib/medicare360/auth/jwt';
import {
  created,
  badRequest,
  conflict,
  serverError,
} from '@/lib/medicare360/utils/apiResponse';
import { logger, sanitizeForLog } from '@/lib/medicare360/utils/logger';

/**
 * POST /api/medicare360/auth/register
 *
 * Public endpoint. Always creates a PATIENT account — other roles
 * are created by admins through the admin panel (Phase 3+).
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body || {};

    // ── Validate ──
    const errors = {};
    if (!email || typeof email !== 'string') errors.email = 'Email is required';
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';

    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.valid) errors.password = pwCheck.reason;

    if (Object.keys(errors).length > 0) {
      return badRequest('Validation failed', errors);
    }

    await connectDB();

    // ── Check for existing user ──
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return conflict('An account with this email already exists');
    }

    // ── Create user ──
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() || '',
      role: ROLES.PATIENT,
      isActive: true,
    });

    // ── Sign JWT and set cookie ──
    const token = signToken({ userId: user._id.toString(), role: user.role });
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, cookieOptions);

    logger.info('User registered', { email: user.email, role: user.role });

    return created(
      {
        user: user.toJSON(),
        token,
      },
      'Account created'
    );
  } catch (err) {
    logger.error('Register error', { err: sanitizeForLog({ m: err.message }) });
    return serverError('Could not create account');
  }
}