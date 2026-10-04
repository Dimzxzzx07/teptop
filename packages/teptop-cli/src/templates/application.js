import {version as runtimeVersion} from 'teptop.js';

export const applicationTemplates = {
  'index.html': "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Teptop App</title></head><body><div id=\"app\"></div><script type=\"module\" src=\"/src/main.tsx\"></script></body></html>\n",
  'src/main.tsx': "import {createRoot} from 'teptop.js';\nimport {App} from './App';\nimport './styles.css';\n\nconst target = document.querySelector('#app');\nif (!target) throw new Error('Missing #app root element.');\ncreateRoot(target).render(App);\n",
  'src/App.tsx': "import {createComponent, useState} from 'teptop.js';\n\nexport const App = createComponent(() => {\n  const [count, setCount] = useState(0);\n  return (\n    <main className=\"app\">\n      <p className=\"eyebrow\">TEPTOP APPLICATION</p>\n      <h1>Hello from Teptop</h1>\n      <p>Interactions: {count()}</p>\n      <button onclick={() => setCount(value => value + 1)}>Increment</button>\n    </main>\n  );\n});\n",
  'src/styles.css': ":root { font-family: system-ui, sans-serif; color: #0f172a; background: #f1f5f9; }\nbody { margin: 0; }\n.app { max-width: 52rem; margin: 8rem auto; padding: 3rem; background: white; border: 1px solid #cbd5e1; border-radius: .5rem; }\n.eyebrow { color: #475569; font-size: .75rem; letter-spacing: .14em; }\nbutton { padding: .7rem 1rem; cursor: pointer; border: 0; border-radius: .25rem; background: #0f172a; color: white; }\n",
  'vite.config.js': "import {defineConfig} from 'vite';\n\nexport default defineConfig({\n  esbuild: {jsx: 'automatic', jsxImportSource: 'teptop.js'},\n});\n",
  'tsconfig.json': "{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"Bundler\",\n    \"jsx\": \"react-jsx\",\n    \"jsxImportSource\": \"teptop.js\",\n    \"strict\": true,\n    \"noEmit\": true,\n    \"lib\": [\"ES2022\", \"DOM\"]\n  },\n  \"include\": [\"src\"]\n}\n",
    'test/app.test.js': "import assert from \u0027node:assert/strict\u0027;\nimport {readFile} from \u0027node:fs/promises\u0027;\nimport test from \u0027node:test\u0027;\n\ntest(\u0027app starter uses the TSX runtime\u0027, async () =\u003e {\n  const source = await readFile(new URL(\u0027../src/App.tsx\u0027, import.meta.url), \u0027utf8\u0027);\n  assert.ok(source.includes(\u0027className=\u0027));\n  assert.ok(source.includes(\u0027createComponent\u0027));\n});",
  'teptop.config.js': "export default {\n  app: {entry: './src/main.tsx'},\n  jsx: {runtime: 'automatic', importSource: 'teptop.js'},\n  test: {pattern: './test/**/*.test.js'},\n};\n",
};

export const minimalTemplates = {
  'index.html': "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Teptop App</title></head><body><div id=\"app\"></div><script type=\"module\" src=\"/src/main.js\"></script></body></html>\n",
  'src/main.js': "import {render} from 'teptop.js';\nimport {App} from './App.js';\nimport './styles.css';\n\nconst target = document.querySelector('#app');\nif (!target) throw new Error('Missing #app root element.');\nrender(App, target);\n",
  'src/App.js': "import {h, signal} from 'teptop.js';\n\nconst count = signal(0);\nexport const App = () => h('main', {className: 'app'},\n  h('h1', null, 'Teptop, without JSX'),\n  h('p', null, () => `Count: ${count()}`),\n  h('button', {onclick: () => count.update(value => value + 1)}, 'Increment'),\n);\n",
  'src/styles.css': "body { margin: 0; font: 16px system-ui, sans-serif; background: #f1f5f9; color: #172033; }\n.app { max-width: 42rem; margin: 10vh auto; padding: 2rem; background: white; border: 1px solid #d8e0ea; }\nbutton { padding: .65rem 1rem; cursor: pointer; }\n",
  'vite.config.js': "import {defineConfig} from 'vite';\nexport default defineConfig({});\n",
  'tsconfig.json': "{\n  \"compilerOptions\": {\"target\": \"ES2022\", \"module\": \"ESNext\", \"moduleResolution\": \"Bundler\", \"allowJs\": true, \"checkJs\": true, \"strict\": true, \"noEmit\": true, \"lib\": [\"ES2022\", \"DOM\"]},\n  \"include\": [\"src\"]\n}\n",
  'teptop.config.js': "export default {projectType: 'application', app: {entry: './src/main.js'}, jsx: false, test: {pattern: './test/**/*.test.js'}};\n",
  'test/app.test.js': "import assert from 'node:assert/strict';\nimport {readFile} from 'node:fs/promises';\nimport test from 'node:test';\n\ntest('minimal starter uses the h() runtime', async () => {\n  const source = await readFile(new URL('../src/App.js', import.meta.url), 'utf8');\n  assert.ok(source.includes('h('));\n  assert.doesNotMatch(source, /<main/);\n});\n",
};

export const libraryTemplates = {
  'src/index.ts': "import {signal} from 'teptop.js';\n\nexport function createCounter(initial = 0) {\n  const value = signal(initial);\n  return {value, increment: () => value.update(current => current + 1)};\n}\n",
  'test/index.test.js': "import assert from 'node:assert/strict';\nimport {readFile} from 'node:fs/promises';\nimport test from 'node:test';\n\ntest('library starter exports a typed Teptop counter', async () => {\n  const source = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');\n  assert.match(source, /createCounter/);\n  assert.match(source, /signal/);\n});\n",
  'tsconfig.json': "{\n  \"compilerOptions\": {\"target\": \"ES2022\", \"module\": \"NodeNext\", \"moduleResolution\": \"NodeNext\", \"strict\": true, \"declaration\": true, \"outDir\": \"dist\", \"rootDir\": \"src\"},\n  \"include\": [\"src/**/*.ts\"]\n}\n",
  'teptop.config.js': "export default {projectType: 'library', entry: './src/index.ts', test: {pattern: './test/**/*.test.js'}};\n",
  'README.md': "# Teptop package\n\nA small Teptop-powered library package.\n",
};

export const templateRegistry = {app: applicationTemplates, minimal: minimalTemplates, library: libraryTemplates};

export const packageTemplate = (name, template = 'app') => ({
  name,
  version: '0.1.0',
  private: true,
  type: 'module',
  scripts: template === 'library'
    ? {build: 'tsc', typecheck: 'tsc --noEmit', test: 'node --test test/*.test.js'}
    : {dev: 'vite', build: 'vite build', preview: 'vite preview', typecheck: 'tsc --noEmit', test: 'node --test test/*.test.js'},
  dependencies: {'teptop.js': `^${runtimeVersion}`},
  devDependencies: template === 'library' ? {typescript: '^5.9.2'} : {typescript: '^5.9.2', vite: '^7.1.7'},
  teptop: {type: template},
  ...(template === 'library' ? {
    main: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {'.': {types: './dist/index.d.ts', import: './dist/index.js'}},
  } : {}),
});

