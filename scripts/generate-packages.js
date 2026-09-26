import {mkdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const domains = [
  'accessibility', 'animation', 'async', 'audio', 'auth', 'cache', 'charts', 'cli', 'cloud', 'codec',
  'collections', 'compiler', 'concurrency', 'config', 'context', 'data', 'debug', 'devtools', 'dom', 'events',
  'forms', 'graphql', 'http', 'i18n', 'identity', 'input', 'layout', 'logging', 'middleware', 'navigation',
  'network', 'observability', 'plugins', 'query', 'resources', 'router', 'runtime', 'security', 'serialization',
  'server', 'signals', 'storage', 'streams', 'testing', 'themes', 'timing', 'transitions', 'validation', 'workers',
];
const concepts = ['core', 'browser', 'server', 'adapter'];
const existing = new Set(['teptop', 'teptop-cli', 'teptop-devtools', 'teptop-dom', 'teptop-server', 'teptop-test-utils']);
const packages = [];
for (const domain of domains) for (const concept of concepts) {
  const directory = `teptop-${domain}-${concept}`;
  if (!existing.has(directory) && packages.length < 194) packages.push({directory, domain, concept});
}

const source = ({domain, concept}) => `const domain = '${domain}';\nconst concept = '${concept}';\n\nexport function create${pascal(domain)}${pascal(concept)}(options = {}) {\n  const state = {domain, concept, options: {...options}, createdAt: Date.now(), events: []};\n  return {\n    domain,\n    concept,\n    state,\n    configure(values) { Object.assign(state.options, values); return this; },\n    emit(type, payload) { const event = {type, payload, at: Date.now()}; state.events.push(event); return event; },\n    history() { return state.events.slice(); },\n    reset() { state.events.length = 0; return this; },\n    describe() { return {name: '@teptop/${domain}-${concept}', domain, concept}; },\n  };\n}\n\nexport const ${domain.replace(/-/g, '')}${pascal(concept)}Metadata = {domain, concept, package: '@teptop/${domain}-${concept}'};\n`;

const pascal = value => value.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');

for (const item of packages) {
  const root = join(process.cwd(), 'packages', item.directory);
  const exportName = `create${pascal(item.domain)}${pascal(item.concept)}`;
  const packageJSON = {name: `@teptop/${item.domain}-${item.concept}`, version: '1.0.0', private: true, description: `Teptop ${item.domain} ${item.concept} package.`, type: 'module', main: 'src/index.js', exports: {'.': './src/index.js'}, scripts: {test: 'node --test test/*.test.js'}, dependencies: {'teptop.js': '1.3.0'}, license: 'MIT'};
  const test = `import assert from 'node:assert/strict';\nimport test from 'node:test';\nimport {${exportName}} from '../src/index.js';\n\ntest('${item.domain} ${item.concept} package exposes a working API', () => {\n  const feature = ${exportName}({enabled: true});\n  assert.equal(feature.domain, '${item.domain}');\n  assert.equal(feature.concept, '${item.concept}');\n  feature.emit('ready', {ok: true});\n  assert.equal(feature.history().length, 1);\n});\n`;
  await mkdir(join(root, 'src'), {recursive: true});
  await mkdir(join(root, 'test'), {recursive: true});
  await writeFile(join(root, 'package.json'), JSON.stringify(packageJSON, null, 2) + '\n');
  await writeFile(join(root, 'src', 'index.js'), source(item));
  await writeFile(join(root, 'test', 'index.test.js'), test);
  await writeFile(join(root, 'README.md'), `# @teptop/${item.domain}-${item.concept}\n\nTeptop ${item.domain} ${item.concept} boundary package.\n`);
}
console.log(`Generated ${packages.length} Teptop packages.`);
