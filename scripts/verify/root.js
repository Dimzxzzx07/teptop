import {spawnSync} from 'node:child_process';
const commands = [['check:structure'], ['check:fixtures'], ['check:compiler']];
for (const args of commands) {
  const npm = process.env.npm_execpath;
  const result = npm ? spawnSync(process.execPath, [npm, 'run', ...args], {stdio: 'inherit'}) : spawnSync('npm', ['run', ...args], {stdio: 'inherit', shell: true});
  if (result.status !== 0) process.exit(result.status || 1);
}
