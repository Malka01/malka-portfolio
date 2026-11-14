/**
 * Minimal structured logger.
 * Never log passwords, tokens, or full request bodies containing secrets.
 */

const isDev = process.env.NODE_ENV !== 'production';

function log(level, message, meta) {
  const ts = new Date().toISOString();
  const prefix = `[mc360][${level.toUpperCase()}][${ts}]`;
  if (meta && Object.keys(meta).length > 0) {
    console[level === 'error' ? 'error' : 'log'](prefix, message, meta);
  } else {
    console[level === 'error' ? 'error' : 'log'](prefix, message);
  }
}

export const logger = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
  debug: (msg, meta) => {
    if (isDev) log('debug', msg, meta);
  },
};

/**
 * Strip sensitive keys before logging.
 */
export function sanitizeForLog(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = { ...obj };
  const sensitive = [
    'password',
    'passwordHash',
    'token',
    'jwt',
    'secret',
    'authorization',
  ];
  for (const key of Object.keys(clone)) {
    if (sensitive.includes(key.toLowerCase())) {
      clone[key] = '[REDACTED]';
    }
  }
  return clone;
}