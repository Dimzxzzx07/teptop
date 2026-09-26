import {createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual} from 'node:crypto';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor']);
const safeProtocols = new Set(['http:', 'https:']);

export class SecurityError extends Error {
  constructor(message, code = 'SECURITY_VALIDATION_FAILED') {
    super(message);
    this.name = 'SecurityError';
    this.code = code;
  }
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));
}

export function sanitizeURL(input, options = {}) {
  const value = String(input).trim();
  if (!value || /[\u0000-\u001f\u007f]/u.test(value)) throw new SecurityError('URL contains control characters.', 'URL_CONTROL_CHARACTER');
  const url = new URL(value, options.base || 'http://localhost');
  const protocols = options.protocols || safeProtocols;
  if (!protocols.has(url.protocol)) throw new SecurityError('URL scheme is not allowed.', 'URL_SCHEME_BLOCKED');
  if (url.username || url.password) throw new SecurityError('URL credentials are not allowed.', 'URL_CREDENTIALS_BLOCKED');
  if (options.origins && !options.origins.includes(url.origin)) throw new SecurityError('URL origin is not allowed.', 'URL_ORIGIN_BLOCKED');
  return url.href;
}

function keyFromSecret(secret) {
  if (!secret || String(secret).length < 32) throw new SecurityError('A secret of at least 32 characters is required.', 'WEAK_SECRET');
  return createHash('sha256').update(String(secret)).digest();
}

function encode(value) {
  return Buffer.from(value).toString('base64url');
}

function decode(value) {
  return Buffer.from(value, 'base64url');
}

export function createTokenManager(secret, options = {}) {
  const key = keyFromSecret(secret);
  const lifetime = options.lifetime ?? 900;
  return {
    issue(claims = {}) {
      const now = Math.floor(Date.now() / 1000);
      const payload = {...claims, iat: now, exp: now + lifetime};
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
      return `v1.${encode(iv)}.${encode(cipher.getAuthTag())}.${encode(ciphertext)}`;
    },
    verify(token) {
      try {
        const parts = String(token).split('.');
        if (parts.length !== 4 || parts[0] !== 'v1') throw new Error('Malformed token.');
        const decipher = createDecipheriv('aes-256-gcm', key, decode(parts[1]));
        decipher.setAuthTag(decode(parts[2]));
        const plaintext = Buffer.concat([decipher.update(decode(parts[3])), decipher.final()]);
        const payload = JSON.parse(textDecoder.decode(plaintext));
        if (!payload || typeof payload !== 'object' || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('Expired token.');
        return payload;
      } catch {
        throw new SecurityError('Token is invalid or expired.', 'TOKEN_INVALID');
      }
    },
  };
}

export function createRateLimiter(options = {}) {
  const limit = options.limit ?? 60;
  const windowMs = options.windowMs ?? 60_000;
  const entries = new Map();
  return {
    consume(key = 'anonymous') {
      const now = Date.now();
      const entry = entries.get(key);
      if (!entry || now >= entry.resetAt) {
        entries.set(key, {count: 1, resetAt: now + windowMs});
        return {allowed: true, remaining: Math.max(0, limit - 1)};
      }
      entry.count++;
      return {allowed: entry.count <= limit, remaining: Math.max(0, limit - entry.count), retryAfter: Math.ceil((entry.resetAt - now) / 1000)};
    },
    clear() { entries.clear(); },
  };
}

function inspectPayload(value, depth, seen) {
  if (depth > 32) throw new SecurityError('Server component payload is too deeply nested.', 'RSC_DEPTH_LIMIT');
  if (value && typeof value === 'object') {
    if (seen.has(value)) throw new SecurityError('Server component payload contains a cycle.', 'RSC_CYCLE');
    seen.add(value);
    for (const [key, child] of Object.entries(value)) {
      if (forbiddenKeys.has(key) || key.startsWith('$')) throw new SecurityError('Server component payload contains a forbidden key.', 'RSC_FORBIDDEN_KEY');
      inspectPayload(child, depth + 1, seen);
    }
    seen.delete(value);
  } else if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
    throw new SecurityError('Server component payload contains an unsupported value.', 'RSC_VALUE_BLOCKED');
  }
}

export function validateServerPayload(payload, options = {}) {
  const maxBytes = options.maxBytes ?? 1_000_000;
  const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
  if (textEncoder.encode(raw).byteLength > maxBytes) throw new SecurityError('Server component payload is too large.', 'RSC_SIZE_LIMIT');
  let parsed;
  try { parsed = typeof payload === 'string' ? JSON.parse(payload) : payload; } catch { throw new SecurityError('Server component payload is not valid JSON.', 'RSC_INVALID_JSON'); }
  inspectPayload(parsed, 0, new Set());
  return parsed;
}

export function hydrationChecksum(markup) {
  return createHash('sha256').update(String(markup)).digest('base64url');
}

export function verifyHydration(markup, checksum) {
  const actual = hydrationChecksum(markup);
  const expected = String(checksum);
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createCacheKey(url, vary = {}) {
  const normalized = sanitizeURL(url);
  const variation = Object.keys(vary).sort().map(key => `${key}:${String(vary[key])}`).join('|');
  return createHash('sha256').update(`${normalized}|${variation}`).digest('hex');
}

export function securityHeaders(options = {}) {
  const nonce = options.nonce || randomBytes(16).toString('base64');
  const headers = {
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cache-Control': options.cacheControl || 'no-store',
  };
  if (options.hsts) headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  return {nonce, headers};
}

export function redactError(error) {
  return {name: 'RequestError', message: 'The request could not be processed.', code: error?.code || 'REQUEST_FAILED'};
}

export function signRequest(value, secret) {
  return createHmac('sha256', keyFromSecret(secret)).update(String(value)).digest('base64url');
}