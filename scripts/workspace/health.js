import {access} from 'node:fs/promises'; for (const file of ['package.json', 'AGENTS.md', 'README.md']) await access(file); console.log('Workspace health check passed.');
