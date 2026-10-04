import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';

const workspaceRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  root: resolve(workspaceRoot, 'apps/playground'),
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'teptop.js',
  },
  server: {
    fs: {allow: [workspaceRoot]},
  },
  build: {
    outDir: resolve(workspaceRoot, 'dist/playground'),
    emptyOutDir: true,
  },
});
