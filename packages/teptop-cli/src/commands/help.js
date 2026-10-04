import chalk from 'chalk';

export function printHelp() {
  console.log(`${chalk.bold('Teptop CLI')}\n\nProject setup:\n  ${chalk.cyan('teptop create <name> [--template app|minimal|library]')}\n  ${chalk.cyan('npm run cli -- create <template> <name>')}\n  ${chalk.cyan('teptop templates')}\n\nScaffolding:\n  ${chalk.cyan('teptop generate page <name>')}\n  ${chalk.cyan('teptop generate component <name>')}\n  ${chalk.cyan('teptop add plugin <name>')}\n  ${chalk.cyan('teptop g <type> <name>')}\n\nProject management:\n  ${chalk.cyan('teptop info')}\n  ${chalk.cyan('teptop doctor')}\n  ${chalk.cyan('teptop config show')}\n\nDevelopment scripts:\n  ${chalk.cyan('teptop dev|build|test|typecheck')}\n\nOther:\n  ${chalk.cyan('teptop version')}\n  ${chalk.cyan('teptop help')}`);
}

export function printTemplates() {
  console.log(`${chalk.bold('Teptop templates')}\n\n  ${chalk.cyan('app')}      Vite + TypeScript + TSX starter (default)\n  ${chalk.cyan('minimal')} h() + JavaScript starter without JSX\n  ${chalk.cyan('library')} Reactive Teptop package with tests`);
}

export function printVersion(cliVersion, runtimeVersion) {
  console.log(`teptop-cli ${cliVersion} (teptop.js ${runtimeVersion})`);
}
