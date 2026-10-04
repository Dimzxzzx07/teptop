import {join} from 'node:path';
import chalk from 'chalk';
import {writeProject} from '../utils/files.js';
import {requireProject} from '../utils/project.js';
import {assertGeneratedName, pascalCase} from '../utils/names.js';

const componentTemplate = name => `import {createComponent} from 'teptop.js';

export const ${name} = createComponent(() => (
  <section className="${name[0].toLowerCase()}${name.slice(1)}">
    <h2>${name}</h2>
  </section>
));
`;

const pageTemplate = name => `import {createComponent} from 'teptop.js';

export const ${name}Page = createComponent(() => (
  <main className="page">
    <h1>${name}</h1>
  </main>
));
`;

const pluginTemplate = name => `import {definePlugin} from 'teptop.js';

export const ${name}Plugin = definePlugin(app => {
  app.emit('plugin:${name[0].toLowerCase()}${name.slice(1)}:installed');
  return () => app.emit('plugin:${name[0].toLowerCase()}${name.slice(1)}:disposed');
}, {name: '${name}'});
`;

const testTemplate = (name, relativePath) => `import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

test('${name} scaffold exports a Teptop component', async () => {
  const source = await readFile(new URL('${relativePath}', import.meta.url), 'utf8');
  assert.match(source, /createComponent/);
});
`;

export async function generateFeature(kind, rawName, cwd = process.cwd()) {
  const project = await requireProject(cwd);
  const name = pascalCase(assertGeneratedName(rawName));
  let files;
  if (kind === 'component') {
    files = {
      [`src/components/${name}.tsx`]: componentTemplate(name),
      [`src/components/${name}.test.js`]: testTemplate(name, `./${name}.tsx`),
    };
  } else if (kind === 'page') {
    files = {
      [`src/pages/${name}Page.tsx`]: pageTemplate(name),
      [`src/pages/${name}Page.test.js`]: testTemplate(`${name} page`, `./${name}Page.tsx`),
    };
  } else if (kind === 'plugin') {
    files = {
      [`src/plugins/${name}Plugin.js`]: pluginTemplate(name),
      [`src/plugins/${name}Plugin.test.js`]: testTemplate(`${name} plugin`, `./${name}Plugin.js`),
    };
  } else {
    throw new Error(`Unknown generator "${kind}". Choose component, page, or plugin.`);
  }
  await writeProject(project.root, files);
  console.log(chalk.green(`Generated ${kind} ${name} in ${project.root}`));
  return {project, files: Object.keys(files), name};
}