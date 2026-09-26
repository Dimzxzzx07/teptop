import {readdir} from 'node:fs/promises'; import {join} from 'node:path';
const root = process.cwd();
async function walk(directory) { const entries = await readdir(directory, {withFileTypes: true}); let files = 0; let dirs = 0; for (const entry of entries) { if (entry.name === 'node_modules') continue; if (entry.isDirectory()) { dirs++; const result = await walk(join(directory, entry.name)); files += result.files; dirs += result.dirs; } else files++; } return {files, dirs}; }
const minimumFiles = 200;
const minimumDirectories = 130;
const result = await walk(root);
console.log(`Teptop structure: ${result.files} files, ${result.dirs} directories`);
if (result.files < minimumFiles || result.dirs < minimumDirectories) {
	console.error(`Structure requirement failed: at least ${minimumFiles} files and ${minimumDirectories} directories are required.`);
	process.exitCode = 1;
}
