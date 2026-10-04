import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {access, readFile} from 'node:fs/promises';
import {dirname, extname, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createAuth} from './auth.js';
import {readJSON, sendError, sendJSON} from './http.js';
import {mimeTypes} from './mime.js';
import {resources, validateRecord} from './resources.js';
import {securityHeaders} from './security.js';
import {createAdminStore} from './store.js';

const require = createRequire(import.meta.url);
const runtimeRoot = dirname(require.resolve('teptop.js'));
const publicRoot = resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceRoot = resolve(projectRoot, 'src');

async function serveFile(response, root, pathname) {
  const requested = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.replace(/^\/+/, ''));
  const file = resolve(root, requested);
  const pathFromRoot = relative(root, file);
  if (pathFromRoot === '..' || pathFromRoot.startsWith(`..${sep}`)) return false;
  try {
    await access(file);
    const body = await readFile(file);
    response.writeHead(200, {'content-type': mimeTypes[extname(file)] || 'application/octet-stream', 'content-length': body.length, 'cache-control': file.endsWith('.html') ? 'no-cache' : 'public, max-age=3600', ...securityHeaders});
    response.end(body);
    return true;
  } catch { return false; }
}

function createRateLimiter({limit = 10, interval = 15 * 60 * 1000} = {}) {
  const attempts = new Map();
  return address => {
    const now = Date.now();
    const recent = (attempts.get(address) || []).filter(time => now - time < interval);
    if (recent.length >= limit) return false;
    recent.push(now);
    attempts.set(address, recent);
    return true;
  };
}

export function createAdminServer(options = {}) {
  const store = createAdminStore(options.dataFile || process.env.DASH_ADMIN_DATA_FILE || resolve(projectRoot, 'data/admin-store.json'));
  const auth = createAuth(options.auth);
  const canAttemptLogin = createRateLimiter(options.loginRateLimit);

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const pathname = url.pathname;
      if (pathname === '/api/health' && request.method === 'GET') return sendJSON(response, 200, {status: 'ok', app: 'teptop-dash-admin'});
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        const address = request.socket.remoteAddress || 'unknown';
        if (!canAttemptLogin(address)) return sendError(response, 429, 'Too many login attempts. Try again later.');
        const credentials = await readJSON(request);
        const session = auth.login(credentials);
        if (!session) return sendError(response, 401, 'Invalid username or password.');
        return sendJSON(response, 200, {user: session.user}, {'set-cookie': auth.cookie(session.token)});
      }
      if (pathname === '/api/auth/logout' && request.method === 'POST') {
        auth.logout(request);
        return sendJSON(response, 200, {ok: true}, {'set-cookie': auth.clearCookie()});
      }
      if (pathname === '/api/auth/me' && request.method === 'GET') {
        const user = auth.session(request);
        return user ? sendJSON(response, 200, {user}) : sendError(response, 401, 'Authentication required.');
      }
      if (pathname.startsWith('/api/')) {
        if (!auth.session(request)) return sendError(response, 401, 'Authentication required.');
        if (pathname === '/api/dashboard' && request.method === 'GET') return sendJSON(response, 200, await store.summary());
        const [, , resourceName, id] = pathname.split('/');
        if (!resources[resourceName]) return sendError(response, 404, 'Resource not found.');
        if (!id && request.method === 'GET') {
          const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
          const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get('perPage')) || 10));
          return sendJSON(response, 200, await store.list(resourceName, {page, perPage, q: url.searchParams.get('q') || '', status: url.searchParams.get('status') || ''}));
        }
        if (!id && request.method === 'POST') {
          const validation = validateRecord(resourceName, await readJSON(request));
          if (validation.error) return sendError(response, 400, validation.error);
          return sendJSON(response, 201, {data: await store.create(resourceName, validation.data)});
        }
        if (id && request.method === 'GET') {
          const record = await store.get(resourceName, id);
          return record ? sendJSON(response, 200, {data: record}) : sendError(response, 404, 'Record not found.');
        }
        if (id && request.method === 'PATCH') {
          const validation = validateRecord(resourceName, await readJSON(request), {partial: true});
          if (validation.error) return sendError(response, 400, validation.error);
          const record = await store.update(resourceName, id, validation.data);
          return record ? sendJSON(response, 200, {data: record}) : sendError(response, 404, 'Record not found.');
        }
        if (id && request.method === 'DELETE') {
          const record = await store.remove(resourceName, id);
          return record ? sendJSON(response, 200, {data: record}) : sendError(response, 404, 'Record not found.');
        }
        return sendError(response, 405, 'Method not allowed.');
      }
      if (pathname.startsWith('/runtime/')) {
        if (await serveFile(response, runtimeRoot, pathname.slice('/runtime'.length))) return;
        return sendError(response, 404, 'Runtime module not found.');
      }
      if (pathname.startsWith('/src/')) {
        if (await serveFile(response, sourceRoot, pathname.slice('/src'.length))) return;
        return sendError(response, 404, 'Application module not found.');
      }
      if (await serveFile(response, publicRoot, pathname)) return;
      if (request.method === 'GET' && await serveFile(response, publicRoot, '/')) return;
      sendError(response, 404, 'Not found.');
    } catch (error) {
      if (!response.headersSent) sendError(response, error.status || 500, error.status ? error.message : 'Internal server error.');
      else response.destroy(error);
    }
  });
  server.store = store;
  server.auth = auth;
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createAdminServer();
  const port = Number(process.env.PORT) || 4175;
  server.listen(port, '127.0.0.1', () => {
    console.log(`Teptop Dash Admin: http://127.0.0.1:${port}`);
    if (!process.env.DASH_ADMIN_USER || !process.env.DASH_ADMIN_PASSWORD) console.log('Development login: admin / teptop-admin (set DASH_ADMIN_USER and DASH_ADMIN_PASSWORD to override)');
  });
}
