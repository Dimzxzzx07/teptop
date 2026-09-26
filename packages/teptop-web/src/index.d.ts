export function renderHTML(template: string, data?: Record<string, unknown>): string;
export function renderPHP(template: string, data?: Record<string, unknown>): string;
export function compileUtilities(classes?: string): string;
export function createStyleSheet(classes?: string): string;
export function loadWasm(file: string, options?: {maxBytes?: number; imports?: WebAssembly.Imports}): Promise<WebAssembly.Instance>;
export function createWebFramework(options?: {root?: string}): {
  root: string;
  html(template: string, data?: Record<string, unknown>): string;
  php(template: string, data?: Record<string, unknown>): string;
  css(classes?: string): string;
  wasm(file: string, options?: {maxBytes?: number; imports?: WebAssembly.Imports}): Promise<WebAssembly.Instance>;
};