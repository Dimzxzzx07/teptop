import {access} from 'node:fs/promises';
import {join} from 'node:path';
import chalk from 'chalk';
import {packageTemplate, templateRegistry} from '../templates/application.js';
import {writeJson, writeProject} from '../utils/files.js';
import {assertProjectName} from '../utils/names.js';

export async function createProject(name, cwd = process.cwd(), template = 'app') {
  assertProjectName(name);
  const files = templateRegistry[template];
  if (!files) throw new Error(`Unknown template "${template}". Available templates: ${Object.keys(templateRegistry).join(', ')}.`);
  const root = join(cwd, name);
  try { await access(root); throw new Error(`Destination already exists: ${root}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await writeProject(root, files);
  await writeJson(join(root, 'package.json'), packageTemplate(name, template));
  return {root, files: Object.keys(files), template};
}

export function printCreated(result) {
  console.log(chalk.green(`Created Teptop ${result.template} project in ${result.root}`));
  console.log(chalk.gray(`${result.files.length + 1} files generated`));
  console.log(chalk.cyan(`Next: cd ${result.root}; npm install; ${result.template === 'library' ? 'npm run build' : 'npm run dev'}`));
}
