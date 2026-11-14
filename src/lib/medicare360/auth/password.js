import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plain) {
  if (!plain || typeof plain !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}

/**
 * Basic password policy for demo purposes.
 * Real systems would add entropy checks and breach-list lookups.
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, reason: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain an uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain a lowercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, reason: 'Password must contain a number' };
  }
  return { valid: true };
}