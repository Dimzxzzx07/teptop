import {readdir, writeFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const root = resolve(dirname(scriptPath), '../..');
const outputPath = join(root, 'README.md');
const excludedDirectoryNames = new Set(['node_modules', '.git']);
const entries = [];

const topLevelDescriptions = {
  apps: 'Runnable applications and interactive examples built on the Teptop runtime.',
  benchmarks: 'Performance-oriented fixtures and scripts for measuring runtime operations.',
  cdn: 'Browser-ready distribution entry points and metadata for CDN consumption.',
  compiler: 'The standalone compiler implementation, transformations, plugins, and compiler tests.',
  configs: 'Shared configuration modules used by project tooling and verification scripts.',
  docs: 'Guides and reference material for framework users and contributors.',
  fixtures: 'Reusable test fixtures, fixture factories, and representative data inputs.',
  'flow-typed': 'Flow declaration files for runtime and companion package surfaces.',
  packages: 'The npm workspace packages, including the core runtime and supporting modules.',
  scripts: 'Maintenance, release, generation, validation, and distribution automation.',
  security: 'Security-focused checks and test cases for repository behavior.',
};

const directoryRoles = {
  adapters: 'Platform and integration adapters',
  apps: 'Application examples',
  benchmarks: 'Benchmark cases and runners',
  browser: 'Browser-specific implementation',
  core: 'Core domain implementation',
  data: 'Data fixtures or data-layer implementation',
  docs: 'Documentation content',
  factories: 'Fixture and test-data factories',
  plugins: 'Compiler or runtime plugins',
  public: 'Publicly served application assets',
  scripts: 'Automation and development scripts',
  server: 'Server-specific implementation',
  src: 'Implementation source files',
  test: 'Automated tests and test support',
  tests: 'Automated tests and test support',
  transforms: 'Compiler transformations',
};

const humanize = value => value
  .replace(/([a-z0-9])([A-Z])/gu, '$1 $2')
  .replace(/[-_.]+/gu, ' ')
  .replace(/\s+/gu, ' ')
  .trim();

async function walk(directory) {
  const children = await readdir(directory, {withFileTypes: true});
  children.sort((left, right) => left.name.localeCompare(right.name, 'en'));
  for (const child of children) {
    if (child.isDirectory() && excludedDirectoryNames.has(child.name)) continue;
    const absolutePath = join(directory, child.name);
    const path = relative(root, absolutePath).split(sep).join('/');
    const type = child.isDirectory() ? 'directory' : child.isFile() ? 'file' : 'other';
    entries.push({absolutePath, name: child.name, path, type});
    if (child.isDirectory()) await walk(absolutePath);
  }
}

function describeDirectory(entry) {
  const parent = entry.path.includes('/') ? entry.path.slice(0, entry.path.lastIndexOf('/')) : 'repository root';
  const role = directoryRoles[entry.name];
  if (entry.path === 'packages') return topLevelDescriptions.packages;
  if (entry.path === 'scripts/docs') return 'Documentation-generation utilities, including this inventory generator.';
  if (entry.path === 'packages/teptop') return 'Core teptop.js npm package: public runtime source, declarations, documentation, and tests.';
  if (entry.path.startsWith('packages/') && entry.path.split('/').length === 2) {
    const packageName = entry.name === 'teptop' ? 'teptop.js' : entry.name.replace(/^teptop-/u, '@teptop/').replace(/-/gu, '-');
    return `Workspace package directory for ${humanize(packageName)}; its child entries document the files actually present.`;
  }
  if (entry.path.split('/').length === 1 && topLevelDescriptions[entry.name]) return topLevelDescriptions[entry.name];
  if (role) return `${role} for ${humanize(parent)}.`;
  return `Groups ${humanize(entry.name)} resources belonging to ${humanize(parent)}.`;
}

function describeFile(entry) {
  const basename = entry.name;
  const parent = entry.path.includes('/') ? entry.path.slice(0, entry.path.lastIndexOf('/')) : 'repository root';
  if (basename === 'README.md') return `Primary orientation and usage guide for ${humanize(parent)}.`;
  if (basename === '.gitignore') return 'Git ignore rules that keep installed node_modules directories out of commits.';
  if (basename === 'package.json') return `npm manifest for ${humanize(parent)}: package identity, exports, scripts, and dependency metadata.`;
  if (basename === 'package-lock.json') return `Resolved npm dependency lockfile for ${humanize(parent)}.`;
  if (basename === 'tsconfig.json') return 'TypeScript compiler configuration for the workspace.';
  if (/\.test\.[cm]?js$/u.test(basename) || /\.spec\.[cm]?js$/u.test(basename)) {
    return `Automated behavior tests for ${humanize(basename.replace(/\.(test|spec)\.[cm]?js$/u, ''))} in ${humanize(parent)}.`;
  }
  if (/\.d\.ts$/u.test(basename)) return `TypeScript declarations for ${humanize(basename.replace(/\.d\.ts$/u, ''))} in ${humanize(parent)}.`;
  if (basename === 'index.js' || basename === 'index.mjs' || basename === 'index.ts') {
    return `Entry point for the ${humanize(parent)} module or package.`;
  }
  const extension = basename.includes('.') ? basename.slice(basename.lastIndexOf('.') + 1).toLowerCase() : '';
  const stem = extension ? basename.slice(0, -(extension.length + 1)) : basename;
  const subject = humanize(stem);
  if (extension === 'js' || extension === 'mjs' || extension === 'cjs' || extension === 'ts') {
    if (parent.split('/').some(part => part === 'test' || part === 'tests')) return `Test support or test case for ${subject} in ${humanize(parent)}.`;
    if (stem.endsWith('.config')) return `Tool configuration module for ${humanize(parent)}.`;
    return `Implementation or automation module for ${subject} in ${humanize(parent)}.`;
  }
  if (extension === 'json') return `Structured configuration or data for ${subject} in ${humanize(parent)}.`;
  if (extension === 'md' || extension === 'mdx') return `Documentation for ${subject} in ${humanize(parent)}.`;
  if (extension === 'html' || extension === 'htm') return `HTML page, template, or markup fixture for ${subject} in ${humanize(parent)}.`;
  if (extension === 'css' || extension === 'scss') return `Stylesheet for ${subject} in ${humanize(parent)}.`;
  if (extension === 'yml' || extension === 'yaml') return `YAML configuration or workflow definition for ${subject} in ${humanize(parent)}.`;
  if (extension === 'svg' || extension === 'png' || extension === 'jpg' || extension === 'webp') return `Visual asset used by ${humanize(parent)}.`;
  if (extension === 'txt' || extension === 'snap' || extension === 'flow') return `Text-based fixture, snapshot, or type metadata for ${subject} in ${humanize(parent)}.`;
  return `Repository asset named ${basename}, associated with ${humanize(parent)}.`;
}

await walk(root);
entries.sort((left, right) => left.path.localeCompare(right.path, 'en'));

const rootFiles = entries.filter(entry => entry.type === 'file' && !entry.path.includes('/'));
const rootDirectories = entries.filter(entry => entry.type === 'directory' && !entry.path.includes('/'));
const files = entries.filter(entry => entry.type === 'file');
const directories = entries.filter(entry => entry.type === 'directory');
const grouped = new Map();
for (const entry of entries) {
  const groupName = entry.path.includes('/') ? entry.path.split('/')[0] : 'Root files';
  if (!grouped.has(groupName)) grouped.set(groupName, []);
  grouped.get(groupName).push(entry);
}

const lines = [
  '# Teptop.js Workspace Guide',
  '',
  'Teptop.js is a signal-first JavaScript UI runtime and application toolkit.',
  '',
  'This root README combines setup guidance with a generated, path-by-path catalog of the workspace.',
  '',
  'The catalog names and describes every file and directory found beneath the repository root.',
  '',
  'Installed `node_modules` directories and Git metadata in `.git` are excluded from the project catalog.',
  '',
  'Hidden files and folders are included when the filesystem makes them visible to this generator.',
  '',
  'Generated build output, fixtures, package internals, tests, manifests, and scripts are included.',
  '',
  'The inventory is a snapshot; rerun the generator after adding, removing, or renaming workspace paths.',
  '',
  'Some package families use a shared generated layout; each path still has its own catalog entry.',
  '',
  'Descriptions are derived from the path, extension, and containing module to make the full tree scannable.',
  '',
  'Read the referenced source or test when implementation details are needed.',
  '',
  '## Quick start',
  '',
  'Requirements: Node.js 20 or newer and npm.',
  '',
  'Install workspace dependencies from the repository root with `npm install`.',
  '',
  'Run the primary runtime test with `npm test`.',
  '',
  'Run the wider test command with `npm run test:all`.',
  '',
  'Run TypeScript declaration checks with `npm run typecheck`.',
  '',
  'Run the browser playground with `npm run demo`.',
  '',
  'Use the project generator with `npm run cli -- create my-app`.',
  '',
  'Run the release metadata check with `npm run check:release`.',
  '',
  'Build CDN output with `npm run build:cdn`.',
  '',
  '## Core runtime',
  '',
  'The public npm package lives in `packages/teptop` and is named `teptop.js`.',
  '',
  'It provides signals, computed values, effects, batching, plain-object views, and a small DOM renderer.',
  '',
  'Higher-level modules add stores, forms, routing, HTTP, query caching, validation, middleware, and collections.',
  '',
  'The root `package.json` is a private workspace manifest; publish runtime packages from their package directories.',
  '',
  'Use the package README at `packages/teptop/README.md` for the detailed public API guide.',
  '',
  '## Top-level map',
  '',
];

for (const directory of rootDirectories) {
  lines.push(`- \`${directory.path}/\` — ${describeDirectory(directory)}`);
}
for (const file of rootFiles) {
  lines.push(`- \`${file.path}\` — ${describeFile(file)}`);
}

lines.push('', '## Complete file and folder inventory', '');
lines.push(`Inventory totals: ${directories.length} directories and ${files.length} files; ${entries.length} paths in all.`, '');
lines.push('Every catalog line below represents one filesystem path.', '');

for (const [groupName, groupEntries] of grouped) {
  const heading = groupName === 'Root files' ? 'Repository root files' : `Repository area: ${humanize(groupName)}`;
  const summary = groupName === 'Root files'
    ? 'Configuration and documentation files located directly at the workspace root.'
    : topLevelDescriptions[groupName] || `Files and directories rooted beneath ${humanize(groupName)}.`;
  lines.push(`### ${heading}`, '', summary, '');
  for (const entry of groupEntries) {
    const displayPath = entry.type === 'directory' ? `${entry.path}/` : entry.path;
    const description = entry.type === 'directory' ? describeDirectory(entry) : describeFile(entry);
    lines.push(`- \`${displayPath}\` — ${description}`);
  }
  lines.push('');
}

lines.push(
  '## Keeping this guide current',
  '',
  'The file catalog is generated from the workspace filesystem rather than maintained as a hand-written list.',
  '',
  'Run `node scripts/docs/generate-root-readme.js` from any working directory to regenerate this README.',
  '',
  'Run `node scripts/docs/verify-root-readme.js` to compare the inventory against the current filesystem.',
  '',
  'The generator traverses directories recursively and skips `node_modules` and `.git` metadata directories.',
  '',
  'The generator does not follow symbolic links as directories.',
  '',
  'Review the generated diff after structural changes so descriptions remain useful and accurate.',
  '',
  'Add or update top-level descriptions in the generator when a new major workspace area is introduced.',
  '',
  'Keep user-facing feature documentation in the relevant package or guide as well as this inventory.',
  '',
);

await writeFile(outputPath, `${lines.join('\n').trimEnd()}\n`, 'utf8');
console.log(`Wrote ${relative(root, outputPath)} with ${entries.length} catalog entries (${directories.length} directories, ${files.length} files).`);
