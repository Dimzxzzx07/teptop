# Security toolkit

The root security module provides defensive primitives for server applications:

- HTML escaping and allow-listed URL schemes to reduce XSS and URL injection.
- AES-256-GCM encrypted tokens with authenticated expiry.
- Recursive, size-limited server payload validation for RSC-like data boundaries.
- Hydration checksums to detect SSR/client markup mismatches.
- Hash-based cache keys, security headers, request rate limiting, and error redaction.

Use `npm run test:security` to run the focused checks. These helpers do not replace
framework updates, dependency security patches, CSP deployment review, or an
application-specific authorization policy. In particular, a CVE in React Server
Components must be addressed by upgrading the affected React packages; this
repository's renderer is not an RSC implementation.