# Production-ready framework checklist

A modern framework needs to be ready for real business delivery, not just local prototyping. Teptop should ship with the following maturity signals:

## Product-ready features

- Fast local development with Vite-powered dev server
- Clear route and layout composition
- Server endpoints or adapter integrations
- SSR and static generation support
- SEO metadata and sitemap support
- Deployment presets for common hosts
- Cache and CDN-friendly static assets
- Observability and error boundaries

## Production pipeline

1. Scaffold a project from a template.
2. Connect API and auth providers.
3. Run local build and preview checks.
4. Validate SEO and metadata for public pages.
5. Deploy with a static or Node-based production target.
6. Monitor errors, latency, and release quality.

## Tooling expectations

- Fast hot reload and predictable bundle output
- Clean code generation and app configuration
- Verified plugin compatibility
- Template quality that reflects real business use cases

## Recommended target outcomes

- 80% of app features should ship from reusable templates and components
- 100% of critical routes should have SSR or SSG coverage when needed
- 0 manual setup steps for common deployment patterns
- Strong cross-team adoption through templates, docs, and plugin guidance
