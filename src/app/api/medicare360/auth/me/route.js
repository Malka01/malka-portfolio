import { requireAuth } from '@/lib/medicare360/auth/middleware';
import { ok, serverError } from '@/lib/medicare360/utils/apiResponse';
import { logger } from '@/lib/medicare360/utils/logger';

/**
 * GET /api/medicare360/auth/me
 *
 * Returns the currently authenticated user, or 401 if not logged in.
 * Used by the frontend to check session on page load.
 */
export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    return ok({ user: user.toJSON() }, 'Authenticated');
  } catch (err) {
    logger.error('Me error', { err: err.message });
    return serverError();
  }
}