import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';

export async function writeProject(root, files) {
  await Promise.all(Object.entries(files).map(async ([file, content]) => {
    const destination = join(root, file);
    await mkdir(dirname(destination), {recursive: true});
    await writeFile(destination, content);
  }));
}

export async function writeJson(file, value) {
  await mkdir(dirname(file), {recursive: true});
  await writeFile(file, JSON.stringify(value, null, 2) + '\n');
}
