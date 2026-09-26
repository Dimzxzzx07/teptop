import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const runtime = join(root, '../../packages/teptop/src/index.js');
const contentTypes = {'.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript'};
const server = createServer(async (request, response) => {
  const pathname = request.url === '/' ? '/index.html' : request.url;
  const file = pathname === '/teptop.js' ? runtime : join(root, pathname);
  try {
    const content = await readFile(file);
    const extension = file.slice(file.lastIndexOf('.'));
    response.writeHead(200, {'content-type': contentTypes[extension] || 'application/octet-stream'});
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

server.listen(4173, () => console.log('Teptop playground: http://localhost:4173'));
