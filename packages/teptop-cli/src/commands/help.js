import chalk from 'chalk';

export function printHelp() {
  console.log(`${chalk.bold('Teptop CLI')}\n\nCommands:\n  ${chalk.cyan('teptop create <name>')}  Create a multi-folder starter application\n  ${chalk.cyan('teptop help')}           Show this help message`);
}
