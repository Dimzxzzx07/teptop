import {access, mkdir, writeFile} from 'node:fs/promises';
import {dirname, isAbsolute, join, relative, resolve, sep} from 'node:path';

export async function writeProject(root, files, options = {}) {
  const projectRoot = resolve(root);
  await Promise.all(Object.entries(files).map(async ([file, content]) => {
    if (isAbsolute(file)) throw new Error(`Project template path must be relative: ${file}`);
    const destination = resolve(projectRoot, file);
    const pathFromRoot = relative(projectRoot, destination);
    if (pathFromRoot === '..' || pathFromRoot.startsWith(`..${sep}`)) throw new Error(`Project template path escapes project root: ${file}`);
    if (!options.overwrite) {
      try { await access(destination); throw new Error(`Refusing to overwrite existing file: ${pathFromRoot}`); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    await mkdir(dirname(destination), {recursive: true});
    await writeFile(destination, content);
  }));
}

export async function writeJson(file, value) {
  await mkdir(dirname(file), {recursive: true});
  await writeFile(file, JSON.stringify(value, null, 2) + '\n');
}
