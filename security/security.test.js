import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createRateLimiter,
  createTokenManager,
  escapeHtml,
  hydrationChecksum,
  sanitizeURL,
  validateServerPayload,
  verifyHydration,
} from './index.js';

test('escapes HTML and blocks dangerous URL schemes', () => {
  assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.throws(() => sanitizeURL('javascript:alert(1)'), {code: 'URL_SCHEME_BLOCKED'});
  assert.equal(sanitizeURL('/dashboard'), 'http://localhost/dashboard');
});

test('encrypts and verifies expiring authentication tokens', () => {
  const tokens = createTokenManager('12345678901234567890123456789012');
  const token = tokens.issue({sub: 'user-1', role: 'user'});
  assert.equal(tokens.verify(token).sub, 'user-1');
  assert.throws(() => tokens.verify(`${token}tampered`), {code: 'TOKEN_INVALID'});
});

test('rejects unsafe server component payloads and oversized input', () => {
  assert.throws(() => validateServerPayload('{"__proto__":"blocked"}'), {code: 'RSC_FORBIDDEN_KEY'});
  assert.throws(() => validateServerPayload('x'.repeat(20), {maxBytes: 10}), {code: 'RSC_SIZE_LIMIT'});
});

test('detects hydration mismatch and limits repeated requests', () => {
  const checksum = hydrationChecksum('<main>safe</main>');
  assert.equal(verifyHydration('<main>safe</main>', checksum), true);
  assert.equal(verifyHydration('<main>changed</main>', checksum), false);
  const limiter = createRateLimiter({limit: 2, windowMs: 1000});
  assert.equal(limiter.consume('ip').allowed, true);
  assert.equal(limiter.consume('ip').allowed, true);
  assert.equal(limiter.consume('ip').allowed, false);
});