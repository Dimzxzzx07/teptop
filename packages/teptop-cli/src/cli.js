#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import ora from 'ora';
import {createProject, printCreated} from './commands/create.js';
import {generateFeature} from './commands/generate.js';
import {diagnoseProject, showProjectConfig, showProjectInfo} from './commands/manage.js';
import {runProjectScript} from './commands/run.js';
import {printHelp, printTemplates, printVersion} from './commands/help.js';
import {version} from './version.js';
import {version as runtimeVersion} from 'teptop.js';

function parseCreateArguments(args) {
	let name;
	let template = 'app';
	if (args.length >= 2 && ['app', 'minimal', 'library'].includes(args[0]) && !args[1].startsWith('-')) {
		return {name: args[1], template: args[0]};
	}
	for (let index = 0; index < args.length; index++) {
		const argument = args[index];
		if (argument === '--template' || argument === '-t') template = args[++index];
		else if (argument.startsWith('--template=')) template = argument.slice('--template='.length);
		else if (!argument.startsWith('-') && !name) name = argument;
		else throw new Error(`Unknown create option: ${argument}`);
	}
	return {name: name || 'teptop-app', template};
}

export async function runCLI(argv = process.argv.slice(2), cwd = process.cwd()) {
	const [command, ...args] = argv;
	try {
		if (!command || command === 'help' || command === '--help' || command === '-h') {
			printHelp();
			return 0;
		}
		if (command === 'version' || command === '--version' || command === '-v') {
			printVersion(version, runtimeVersion);
			return 0;
		}
		if (command === 'templates') {
			printTemplates();
			return 0;
		}
		if (command === 'create' || command === 'init') {
			const {name, template} = parseCreateArguments(args);
			const spinner = ora(`Creating ${name} (${template})`).start();
			try {
				const result = await createProject(name, cwd, template);
				spinner.succeed('Project created');
				printCreated(result);
				return 0;
			} catch (error) {
				spinner.fail('Project creation failed');
				throw error;
			}
		}
		if (command === 'generate' || command === 'g') {
			const [kind, name, ...extra] = args;
			if (!kind || !name || extra.length) throw new Error('Usage: teptop generate <page|component> <name>');
			await generateFeature(kind, name, cwd);
			return 0;
		}
		if (command === 'add') {
			const [kind, name, ...extra] = args;
			if (!kind || !name || extra.length) throw new Error('Usage: teptop add plugin <name>');
			await generateFeature(kind, name, cwd);
			return 0;
		}
		if (command === 'page' || command === 'component') {
			if (args.length !== 1) throw new Error(`Usage: teptop ${command} <name>`);
			await generateFeature(command, args[0], cwd);
			return 0;
		}
		if (command === 'info') {
			await showProjectInfo(cwd);
			return 0;
		}
		if (command === 'doctor') {
			const result = await diagnoseProject(cwd);
			return result.ok ? 0 : 1;
		}
		if (command === 'config') {
			if (args[0] !== 'show' || args.length > 1) throw new Error('Usage: teptop config show');
			await showProjectConfig(cwd);
			return 0;
		}
		if (['dev', 'build', 'preview', 'test', 'typecheck'].includes(command)) {
			return await runProjectScript(command, args, cwd);
		}
		if (command === 'run') {
			const [script, ...scriptArgs] = args;
			if (!script) throw new Error('Usage: teptop run <script> [arguments...]');
			return await runProjectScript(script, scriptArgs, cwd);
		}
		throw new Error(`Unknown command "${command}". Run teptop help to see available commands.`);
	} catch (error) {
		console.error(error.message);
		return 1;
	}
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	process.exitCode = await runCLI();
}
