import {access, readFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';

const exists = async path => { try { await access(path); return true; } catch { return false; } };

export async function findProject(start = process.cwd()) {
  let directory = resolve(start);
  while (true) {
    const manifestPath = join(directory, 'package.json');
    if (await exists(manifestPath)) {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      if (manifest.dependencies?.['teptop.js'] || manifest.devDependencies?.['teptop.js'] || await exists(join(directory, 'teptop.config.js'))) {
        return {root: directory, manifest, manifestPath};
      }
    }
    const parent = dirname(directory);
    if (parent === directory) return null;
    directory = parent;
  }
}

export async function requireProject(start = process.cwd()) {
  const project = await findProject(start);
  if (!project) throw new Error('Not inside a Teptop project. Run this command from a generated project directory.');
  return project;
}

export async function readTeptopConfig(project) {
  const path = join(project.root, 'teptop.config.js');
  if (!(await exists(path))) return null;
  return readFile(path, 'utf8');
}
