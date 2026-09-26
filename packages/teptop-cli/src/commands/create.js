import {join} from 'node:path';
import chalk from 'chalk';
import {applicationTemplates, packageTemplate} from '../templates/application.js';
import {writeJson, writeProject} from '../utils/files.js';

export async function createProject(name, cwd = process.cwd()) {
  const root = join(cwd, name);
  await writeProject(root, applicationTemplates);
  await writeJson(join(root, 'package.json'), packageTemplate(name));
  return {root, files: Object.keys(applicationTemplates)};
}

export function printCreated(result) {
  console.log(chalk.green(`Created Teptop application in ${result.root}`));
  console.log(chalk.gray(`${result.files.length} template files generated`));
}
