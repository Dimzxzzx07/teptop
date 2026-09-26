import {readFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {renderHTML} from './browser.js';

const allowedWasmExtensions = new Set(['.wasm']);
export {compileUtilities, createStyleSheet, renderHTML} from './browser.js';

export function renderPHP(template, data = {}) {
  const output = renderHTML(template, data);
  return `<?php declare(strict_types=1); ?>\n${output}`;
}

export async function loadWasm(file, options = {}) {
  const path = resolve(file);
  if (!allowedWasmExtensions.has(extname(path).toLowerCase())) throw new TypeError('Only .wasm modules can be loaded.');
  const bytes = await readFile(path);
  const maxBytes = options.maxBytes ?? 16 * 1024 * 1024;
  if (bytes.byteLength > maxBytes) throw new RangeError(`WASM module exceeds the ${maxBytes}-byte limit.`);
  const imports = options.imports || {};
  const result = await WebAssembly.instantiate(bytes, imports);
  return result.instance;
}

export function createWebFramework(options = {}) {
  const root = options.root || process.cwd();
  return {
    root,
    html(template, data) { return renderHTML(template, data); },
    php(template, data) { return renderPHP(template, data); },
    css(classes) { return createStyleSheet(classes); },
    wasm(file, wasmOptions) { return loadWasm(resolve(root, file), wasmOptions); },
  };
}