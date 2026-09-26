import {createHash, randomBytes} from 'node:crypto';

const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor']);

export function validateServerPayload(payload, options = {}) {
  const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const maxBytes = options.maxBytes ?? 1_000_000;
  if (Buffer.byteLength(raw, 'utf8') > maxBytes) throw new Error('Server payload exceeds the configured size limit.');
  let parsed;
  try { parsed = typeof payload === 'string' ? JSON.parse(payload) : payload; } catch { throw new Error('Server payload is not valid JSON.'); }
  inspectPayload(parsed, 0, new Set());
  return parsed;
}

function inspectPayload(value, depth, seen) {
  if (depth > 32) throw new Error('Server payload exceeds the nesting limit.');
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) throw new Error('Server payload contains a cycle.');
  seen.add(value);
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key) || key.startsWith('$')) throw new Error('Server payload contains a forbidden key.');
    inspectPayload(child, depth + 1, seen);
  }
  seen.delete(value);
}

export function hydrationChecksum(markup) {
  return createHash('sha256').update(String(markup)).digest('base64url');
}

export function securityHeaders(options = {}) {
  const nonce = options.nonce || randomBytes(16).toString('base64');
  return {
    nonce,
    headers: {
      'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Cache-Control': options.cacheControl || 'no-store',
    },
  };
}