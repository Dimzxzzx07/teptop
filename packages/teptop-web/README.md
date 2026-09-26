# @teptop/web

Unified web integration for Teptop.js projects:

- `renderHTML` interpolates escaped `{{paths}}` into standalone HTML.
- `renderPHP` creates a PHP-compatible document while keeping markup separate.
- `createStyleSheet` provides a small dependency-free Tailwind-style utility layer.
- `loadWasm` loads local `.wasm` modules with extension and size checks.

PHP execution still requires a PHP runtime. WebAssembly modules should be compiled
with an external toolchain and are loaded only at runtime.