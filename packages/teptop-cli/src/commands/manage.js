import {access, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import chalk from 'chalk';
import {requireProject, readTeptopConfig} from '../utils/project.js';

const exists = async path => { try { await access(path); return true; } catch { return false; } };

export async function showProjectInfo(cwd = process.cwd()) {
  const project = await requireProject(cwd);
  const info = {
    name: project.manifest.name,
    root: project.root,
    version: project.manifest.version || '0.0.0',
    teptop: project.manifest.dependencies?.['teptop.js'] || project.manifest.devDependencies?.['teptop.js'] || 'not installed',
    scripts: Object.keys(project.manifest.scripts || {}),
  };
  console.log(`${chalk.bold('Teptop project')}\n${JSON.stringify(info, null, 2)}`);
  return info;
}

export async function diagnoseProject(cwd = process.cwd()) {
  const project = await requireProject(cwd);
  const scripts = project.manifest.scripts || {};
  const projectType = project.manifest.teptop?.type || 'application';
  const checks = [
    {name: 'Node.js 20+', ok: Number(process.versions.node.split('.')[0]) >= 20},
    {name: 'Teptop runtime dependency', ok: Boolean(project.manifest.dependencies?.['teptop.js'] || project.manifest.devDependencies?.['teptop.js'])},
    {name: 'Build script', ok: Boolean(scripts.build)},
    {name: 'Teptop config', ok: await exists(join(project.root, 'teptop.config.js'))},
  ];
  if (projectType === 'library' || scripts.typecheck) checks.push({name: 'TypeScript config', ok: await exists(join(project.root, 'tsconfig.json'))});
  if (projectType !== 'library') {
    checks.push({name: 'Vite dev script', ok: Boolean(scripts.dev)});
    checks.push({name: 'Vite config', ok: await exists(join(project.root, 'vite.config.js'))});
  }
  checks.forEach(check => console.log(`${check.ok ? chalk.green('PASS') : chalk.yellow('WARN')} ${check.name}`));
  return {project, checks, ok: checks.every(check => check.ok)};
}

export async function showProjectConfig(cwd = process.cwd()) {
  const project = await requireProject(cwd);
  const config = await readTeptopConfig(project);
  if (!config) throw new Error('No teptop.config.js found in this project.');
  console.log(config.trimEnd());
  return config;
}

export async function readProjectManifest(cwd = process.cwd()) {
  const project = await requireProject(cwd);
  return JSON.parse(await readFile(project.manifestPath, 'utf8'));
}