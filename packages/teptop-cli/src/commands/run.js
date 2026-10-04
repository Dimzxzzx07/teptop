import {spawn} from 'node:child_process';
import {access} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import chalk from 'chalk';
import {requireProject} from '../utils/project.js';

async function npmInvocation() {
  if (process.env.npm_execpath) return {command: process.execPath, prefix: [process.env.npm_execpath]};
  if (process.platform !== 'win32') return {command: 'npm', prefix: []};
  const candidates = [
    join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    join(process.env.APPDATA || '', 'npm', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ];
  for (const candidate of candidates) {
    try { await access(candidate); return {command: process.execPath, prefix: [candidate]}; }
    catch {}
  }
  throw new Error('Cannot locate npm CLI. Install Node.js with npm or run the project script with npm directly.');
}

export async function runProjectScript(script, args = [], cwd = process.cwd()) {
  const project = await requireProject(cwd);
  if (!project.manifest.scripts?.[script]) {
    const available = Object.keys(project.manifest.scripts || {}).join(', ') || 'none';
    throw new Error(`Project script "${script}" is not defined. Available scripts: ${available}.`);
  }
  console.log(chalk.cyan(`Running npm run ${script}`));
  const npm = await npmInvocation();
  const env = {...process.env};
  delete env.NODE_TEST_CONTEXT;
  return new Promise((resolve, reject) => {
    const child = spawn(npm.command, [...npm.prefix, 'run', script, ...(args.length ? ['--', ...args] : [])], {
      cwd: project.root,
      stdio: 'inherit',
      env,
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal) reject(new Error(`npm run ${script} stopped by ${signal}`));
      else resolve(code ?? 1);
    });
  });
}
