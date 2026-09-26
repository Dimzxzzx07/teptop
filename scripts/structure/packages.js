import {readdir} from 'node:fs/promises'; const entries = await readdir('packages', {withFileTypes: true}); console.log(`Workspace packages: ${entries.filter(entry => entry.isDirectory()).length}`);
