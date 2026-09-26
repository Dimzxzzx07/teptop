import {access, readFile, readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join, resolve} from 'node:path';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const supported = ['teptop', 'teptop-server', 'teptop-web', 'teptop-cli'];
const failures = [];

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function checkPackage(directory, publishable = false) {
  const packageRoot = join(root, 'packages', directory);
  const manifest = JSON.parse((await readFile(join(packageRoot, 'package.json'), 'utf8')).replace(/^\uFEFF/u, ''));
  if (!manifest.name || !manifest.version || !manifest.description || !manifest.license) failures.push(`${directory}: missing npm metadata`);
  if (manifest.version !== rootVersion) failures.push(`${directory}: version ${manifest.version} does not match workspace version ${rootVersion}`);
  if (publishable && manifest.private) failures.push(`${directory}: package must not be private`);
  if (manifest.main && !await exists(join(packageRoot, manifest.main))) failures.push(`${directory}: main file does not exist`);
  if (manifest.types && !await exists(join(packageRoot, manifest.types))) failures.push(`${directory}: types file does not exist`);
  for (const [name, target] of Object.entries(manifest.exports || {})) {
    const entry = typeof target === 'string' ? target : target.import || target.default || target.require || target.types;
    if (entry && !await exists(join(packageRoot, entry))) failures.push(`${directory}: export ${name} points to a missing file`);
  }
  if (manifest.dependencies?.['teptop.js'] && manifest.dependencies['teptop.js'] !== rootVersion) failures.push(`${directory}: teptop.js dependency does not match workspace version ${rootVersion}`);
}

const rootManifest = JSON.parse((await readFile(join(root, 'package.json'), 'utf8')).replace(/^\uFEFF/u, ''));
const rootVersion = rootManifest.version;
if (!rootManifest.private) failures.push('root workspace must remain private; publish packages individually');
for (const directory of supported) await checkPackage(directory, true);
for (const entry of await readdir(join(root, 'packages'), {withFileTypes: true})) {
  if (entry.isDirectory() && !supported.includes(entry.name)) await checkPackage(entry.name, false);
}
if (failures.length) {
  console.error(failures.map(failure => `Release check failed: ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Release metadata valid for: ${supported.join(', ')}`);
}