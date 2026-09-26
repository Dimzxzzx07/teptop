import {readFileSync} from 'node:fs';

const readTemplate = name => readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');
const htmlTemplate = readTemplate('index.html');
const phpTemplate = readTemplate('index.php');
const wasmReadme = readTemplate('README-wasm.md');

export const applicationTemplates = {
  'src/main.js': "import {createRoot} from 'teptop.js';\nimport {App} from './app.js';\nimport './styles.css';\n\ncreateRoot(document.querySelector('#app')).render(App);\n",
  'src/app.js': "import {createComponent, h, useState} from 'teptop.js';\n\nexport const App = createComponent(() => {\n  const [count, setCount] = useState(0);\n  return h('main', {className: 'app'},\n    h('p', {className: 'eyebrow'}, 'TEPTOP APPLICATION'),\n    h('h1', null, 'Hello from Teptop'),\n    h('p', null, `Interactions: ${count()}`),\n    h('button', {onclick: () => setCount(value => value + 1)}, 'Increment'),\n  );\n});\n",
  'src/styles.css': ":root { font-family: system-ui, sans-serif; color: #0f172a; background: #f1f5f9; }\nbody { margin: 0; }\n.app { max-width: 52rem; margin: 8rem auto; padding: 3rem; background: white; border: 1px solid #cbd5e1; border-radius: .5rem; }\n.eyebrow { color: #475569; font-size: .75rem; letter-spacing: .14em; }\nbutton { padding: .7rem 1rem; cursor: pointer; border: 0; border-radius: .25rem; background: #0f172a; color: white; }\n",
  'public/index.html': htmlTemplate,
  'server/index.php': phpTemplate,
  'wasm/README.md': wasmReadme,
  'test/app.test.js': "import assert from 'node:assert/strict';\nimport test from 'node:test';\nimport {App} from '../src/app.js';\n\ntest('generated app exports a component', () => {\n  assert.equal(typeof App, 'function');\n});\n",
  'teptop.config.js': "export default {\n  app: {entry: './src/main.js'},\n  test: {pattern: './test/**/*.test.js'},\n};\n",
};

export const packageTemplate = name => ({
  name,
  private: true,
  type: 'module',
  scripts: {dev: 'teptop dev', test: 'node --test test/**/*.test.js'},
  dependencies: {'@teptop/web': '0.0.1', 'teptop.js': '0.0.1'},
});

