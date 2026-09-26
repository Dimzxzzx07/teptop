import {rm} from 'node:fs/promises'; await rm('.teptop-generated-check', {recursive: true, force: true}); console.log('Workspace generated artifacts cleaned.');
