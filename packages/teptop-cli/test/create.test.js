import assert from 'node:assert/strict';
import {access, mkdtemp, readFile, rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {createProject} from '../src/commands/create.js';
import {generateFeature} from '../src/commands/generate.js';
import {diagnoseProject, showProjectInfo, showProjectConfig} from '../src/commands/manage.js';
import {runProjectScript} from '../src/commands/run.js';

const cliEntry = fileURLToPath(new URL('../src/cli.js', import.meta.url));

test('CLI creates a Vite and TSX starter with aligned runtime version', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'teptop-starter-'));
  try {
    const result = await createProject('starter-app', directory);
    const manifest = JSON.parse(await readFile(join(result.root, 'package.json'), 'utf8'));
    const component = await readFile(join(result.root, 'src/App.tsx'), 'utf8');
    assert.equal(manifest.dependencies['teptop.js'], '^0.0.4');
    assert.equal(manifest.scripts.dev, 'vite');
    assert.match(component, /<main className=/);
    assert.ok(result.files.includes('vite.config.js'));
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('CLI supports minimal h() and library templates', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'teptop-templates-'));
  try {
    const minimal = await createProject('minimal-app', directory, 'minimal');
    const minimalSource = await readFile(join(minimal.root, 'src/App.js'), 'utf8');
    assert.match(minimalSource, /h\('main'/);
    assert.doesNotMatch(minimalSource, /<main/);

    const library = await createProject('my-library', directory, 'library');
    const libraryManifest = JSON.parse(await readFile(join(library.root, 'package.json'), 'utf8'));
    assert.equal(libraryManifest.scripts.build, 'tsc');
    assert.equal(library.files.includes('index.html'), false);
    assert.equal((await diagnoseProject(library.root)).ok, true);
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('CLI generates pages and components inside a Teptop project', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'teptop-generate-'));
  try {
    const project = await createProject('dashboard', directory);
    const component = await generateFeature('component', 'status-badge', project.root);
    const page = await generateFeature('page', 'account-settings', project.root);
    const plugin = await generateFeature('plugin', 'analytics', project.root);
    assert.equal(component.name, 'StatusBadge');
    assert.equal(page.name, 'AccountSettings');
    assert.equal(plugin.name, 'Analytics');
    assert.match(await readFile(join(project.root, 'src/components/StatusBadge.tsx'), 'utf8'), /createComponent/);
    assert.match(await readFile(join(project.root, 'src/pages/AccountSettingsPage.tsx'), 'utf8'), /<main/);
    assert.match(await readFile(join(project.root, 'src/plugins/AnalyticsPlugin.js'), 'utf8'), /definePlugin/);
    assert.equal((await diagnoseProject(project.root)).ok, true);
    assert.match(await showProjectConfig(project.root), /importSource: 'teptop.js'/);
    assert.equal((await showProjectInfo(project.root)).teptop, '^0.0.4');
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('CLI refuses unsafe names and overwriting project folders', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'teptop-safe-create-'));
  try {
    await assert.rejects(createProject('../outside', directory), /Invalid project name/);
    await createProject('safe-app', directory);
    await assert.rejects(createProject('safe-app', directory), /Destination already exists/);
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('CLI executable parses template options and forwards project scripts', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'teptop-cli-entry-'));
  try {
    const created = spawnSync(process.execPath, [cliEntry, 'create', 'cli-app', '--template', 'minimal'], {cwd: directory, encoding: 'utf8'});
    assert.equal(created.status, 0, created.stderr);
    const appRoot = join(directory, 'cli-app');
    await access(join(appRoot, 'src/App.js'));
    assert.equal(await runProjectScript('test', [], appRoot), 0);
    const plugin = spawnSync(process.execPath, [cliEntry, 'add', 'plugin', 'metrics'], {cwd: appRoot, encoding: 'utf8'});
    assert.equal(plugin.status, 0, plugin.stderr);
    await access(join(appRoot, 'src/plugins/MetricsPlugin.js'));
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('CLI exposes a version command', () => {
  const result = spawnSync(process.execPath, [cliEntry, 'version'], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /teptop-cli 0\.0\.4/);
  assert.match(result.stdout, /teptop\.js 0\.0\.4/);
});
