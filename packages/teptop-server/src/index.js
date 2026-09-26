import {toHTML} from 'teptop.js/server';
import {hydrationChecksum, securityHeaders, validateServerPayload} from './security.js';

export function renderToString(view, options = {}) {
  const markup = toHTML(view);
  if (options.serverPayload !== undefined) validateServerPayload(options.serverPayload, options.security);
  if (options.document === false) return markup;
  const title = options.title ? `<title>${escapeHtml(options.title)}</title>` : '';
  const security = options.securityHeaders ? securityHeaders(options.securityHeaders) : null;
  const nonce = security ? `<meta name="teptop-hydration" content="${hydrationChecksum(markup)}"><meta name="teptop-csp-nonce" content="${escapeHtml(security.nonce)}">` : '';
  return `<!doctype html><html lang="${escapeHtml(options.lang || 'en')}"><head><meta charset="UTF-8">${title}${nonce}</head><body>${markup}</body></html>`;
}

export {hydrationChecksum, securityHeaders, validateServerPayload};

export function createRenderStream(view, options = {}) {
  let closed = false;
  return {
    async *[Symbol.asyncIterator]() {
      if (closed) return;
      yield renderToString(view, options);
    },
    close() { closed = true; },
  };
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
