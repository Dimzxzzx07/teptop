#!/usr/bin/env node
import ora from 'ora';
import {createProject, printCreated} from './commands/create.js';
import {printHelp} from './commands/help.js';

const [command, name = 'teptop-app'] = process.argv.slice(2);

if (command === 'create') {
	const spinner = ora(`Creating ${name}`).start();
	try {
		const result = await createProject(name);
		spinner.succeed('Project created');
		printCreated(result);
	} catch (error) {
		spinner.fail('Project creation failed');
		console.error(error.message);
		process.exitCode = 1;
	}
} else printHelp();
