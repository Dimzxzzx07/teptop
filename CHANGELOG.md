# Changelog

## 0.0.4

- Keep fragments transparent in DOM and server output, with range-based keyed reconciliation.
- Add controlled DOM property updates, SVG namespace support, component cleanup on branch removal, and explicit hydration mismatch errors.
- Hydrate server-rendered nodes in place and attach event handlers without duplicating markup.
- Add the automatic `teptop.js/jsx-runtime` and `teptop.js/jsx-dev-runtime` exports.
- Establish Vite + TSX as the documented starter path while keeping direct `h()` usage compiler-free.
- Align active package versions and companion runtime dependencies at `0.0.4`.