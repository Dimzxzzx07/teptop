export function renderToString(view: unknown, options?: {
  document?: boolean;
  title?: string;
  lang?: string;
  serverPayload?: unknown;
  security?: {maxBytes?: number};
  securityHeaders?: {nonce?: string; hsts?: boolean; cacheControl?: string};
}): string;
export function createRenderStream(view: unknown, options?: Record<string, unknown>): AsyncIterable<string>;
export function hydrationChecksum(markup: string): string;
export function validateServerPayload(payload: unknown, options?: {maxBytes?: number}): unknown;
export function securityHeaders(options?: {nonce?: string; hsts?: boolean; cacheControl?: string}): {nonce: string; headers: Record<string, string>};