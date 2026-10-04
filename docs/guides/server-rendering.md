# SSR, SEO, and production rendering

Teptop should support server-side rendering, static generation, and server-driven app shells to be competitive with modern frameworks in production workloads.

## Recommended rendering model

- SSR for authenticated dashboards and marketing pages
- SSG for static landing pages and product docs
- CSR for interactive, state-heavy tools after hydration
- Hybrid routes that choose a rendering mode per page

## Production patterns

```js
export async function renderPage(entry, context) {
  const html = await entry.renderToString(context);
  return `<!doctype html>${html}`;
}
```

## SEO checklist

- Canonical URLs
- Fast LCP and TTFB
- Metadata generation per route
- Social cards and Open Graph tags
- Sitemap generation
- Structured data for product and article pages

## DX notes

Use the same routing, data-fetching, and layout model on server and client. This reduces duplication and keeps the product ready for app-router patterns, deployment pipelines, and SEO-critical pages.

## Production benchmark targets

- SSR cold response under 300-600 ms in normal workloads
- Hydration should be incremental and not block the main thread
- Static assets should be cached and compressed
- Bundles should remain lean for mobile and low-end devices
