export class SecurityError extends Error { code: string; }
export function escapeHtml(value: unknown): string;
export function sanitizeURL(input: string, options?: {base?: string; protocols?: Set<string>; origins?: string[]}): string;
export function createTokenManager(secret: string, options?: {lifetime?: number}): {issue(claims?: Record<string, unknown>): string; verify(token: string): Record<string, unknown>};
export function createRateLimiter(options?: {limit?: number; windowMs?: number}): {consume(key?: string): {allowed: boolean; remaining: number; retryAfter?: number}; clear(): void};
export function validateServerPayload(payload: unknown, options?: {maxBytes?: number}): unknown;
export function hydrationChecksum(markup: string): string;
export function verifyHydration(markup: string, checksum: string): boolean;
export function createCacheKey(url: string, vary?: Record<string, unknown>): string;
export function securityHeaders(options?: {nonce?: string; hsts?: boolean; cacheControl?: string}): {nonce: string; headers: Record<string, string>};
export function redactError(error: unknown): {name: string; message: string; code: string};
export function signRequest(value: string, secret: string): string;