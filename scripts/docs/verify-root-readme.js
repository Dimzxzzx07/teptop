import {readFile, readdir} from 'node:fs/promises';
import {dirname, join, relative, sep, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const actual = [];

async function walk(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
    }
    const absolutePath = join(directory, entry.name);
    actual.push(relative(root, absolutePath).split(sep).join('/'));
    if (entry.isDirectory()) await walk(absolutePath);
  }
}

await walk(root);
const text = await readFile(join(root, 'README.md'), 'utf8');
const lines = text.split(/\r?\n/u);
const start = lines.indexOf('## Complete file and folder inventory');
const end = lines.indexOf('## Keeping this guide current');
if (start < 0 || end <= start) throw new Error('README inventory section is missing or malformed.');

const listed = [];
for (const line of lines.slice(start, end)) {
  if (!line.startsWith('- ')) continue;
  const firstTick = line.indexOf('`');
  const closing = line.indexOf('` — ', firstTick + 1);
  if (firstTick < 0 || closing < 0) continue;
  listed.push(line.slice(firstTick + 1, closing).replace(/\/$/u, ''));
}

const actualSet = new Set(actual);
const listedSet = new Set(listed);
const missing = actual.filter(path => !listedSet.has(path));
const extra = listed.filter(path => !actualSet.has(path));
const duplicates = listed.length - listedSet.size;
const failures = [];
if (missing.length) failures.push(`${missing.length} filesystem paths are missing from README`);
if (extra.length) failures.push(`${extra.length} README entries do not exist in the filesystem`);
if (duplicates) failures.push(`${duplicates} duplicate inventory entries found`);
if (lines.length <= 2000) failures.push(`README has ${lines.length} lines; it must exceed 2000`);

if (failures.length) {
  console.error(failures.join('\n'));
  if (missing.length) console.error(`Missing: ${missing.slice(0, 20).join(', ')}`);
  if (extra.length) console.error(`Extra: ${extra.slice(0, 20).join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`README verified: ${lines.length} lines, ${listed.length} paths (${actual.length} filesystem paths), node_modules and .git excluded.`);
}
