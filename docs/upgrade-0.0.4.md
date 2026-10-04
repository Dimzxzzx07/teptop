# Upgrade to 0.0.4

## Renderer and fragments

`Fragment` no longer produces a `<span>` wrapper. DOM fragments are represented by comment anchors, so layout and selectors should target the fragment's actual children rather than a wrapper element. Server serialization includes Teptop fragment/text boundary comments so browser parsing preserves node ranges.

Keyed child reconciliation now moves existing DOM ranges. Keep keys stable and unique among siblings; duplicate keys throw an error.

Controlled `value`, `checked`, and `selected` props update DOM properties. Numeric unitless CSS properties such as `opacity` remain unitless; dimensional values such as `width: 20` become `20px`.

## Hydration

`hydrate(view, target)` now adopts compatible SSR nodes and attaches client event handlers without inserting a second copy of the markup. Structural mismatches throw `HydrationMismatchError` before modifying the target.

If an application intentionally wants client rendering as a fallback, handle that policy explicitly:

```js
import {HydrationMismatchError, hydrate, render} from 'teptop.js';

let root;
try {
  root = hydrate(App, target);
} catch (error) {
  if (!(error instanceof HydrationMismatchError)) throw error;
  target.replaceChildren();
  root = render(App, target);
}
```

Hydration is synchronous tree adoption. Streaming and partial hydration are not included.

## JSX and Vite

The supported TSX route uses TypeScript's automatic transform with `jsx: "react-jsx"` and `jsxImportSource: "teptop.js"`. The runtime comes from `teptop.js/jsx-runtime`; no React runtime or React plugin is required. The CLI starter configures Vite, TypeScript, and TSX.

Existing JavaScript applications using `h()` do not need to migrate to JSX or install Vite.

## Release

The workspace and active companion packages are aligned at `0.0.4`. Review [CHANGELOG.md](../CHANGELOG.md) and the installed package export map before publishing or pinning companion versions.
