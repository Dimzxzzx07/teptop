import {execFile} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir, readFile, rename, writeFile} from 'node:fs/promises';
import {join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const output = join(root, 'cdn');
const entry = relative(root, join(root, 'packages', 'teptop', 'src', 'index.js'));
const run = promisify(execFile);

async function build() {
  process.chdir(root);
  await mkdir(output, {recursive: true});
  const executable = join(root, 'node_modules', 'tsup', 'dist', 'cli-default.js');
  const common = [entry, '--out-dir', 'cdn', '--sourcemap', '--minify', '--no-dts', '--platform', 'browser', '--target', 'es2020'];
  await run(process.execPath, [executable, ...common, '--format', 'esm', '--clean'], {cwd: root});
  await run(process.execPath, [executable, ...common, '--format', 'iife', '--global-name', 'Teptop'], {cwd: root});
  const iifeOutput = join(output, 'index.global.js');
  const defaultIifeOutput = join(output, 'index.iife.js');
  if (!(await exists(iifeOutput)) && await exists(defaultIifeOutput)) await rename(defaultIifeOutput, iifeOutput);
  const files = ['index.js', 'index.global.js'];
  const manifest = {version: JSON.parse(await readFile(join(root, 'packages', 'teptop', 'package.json'), 'utf8')).version, files: {}};
  for (const file of files) {
    const path = join(output, file);
    const content = await readFile(path);
    manifest.files[file] = {bytes: content.byteLength, sha256: createHash('sha256').update(content).digest('hex')};
  }
  await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`CDN build ready in ${output}`);
}

async function exists(path) {
  try { await readFile(path); return true; } catch { return false; }
}

build().catch(error => {
  console.error(`CDN build failed: ${error.message}`);
  console.error('Install workspace devDependencies before building: npm install');
  process.exitCode = 1;
});