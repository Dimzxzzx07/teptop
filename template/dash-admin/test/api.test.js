import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {createAdminServer} from '../server/index.js';

async function startServer(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'teptop-dash-admin-'));
  const server = createAdminServer({dataFile: join(directory, 'store.json'), auth: {username: 'owner', password: 'secure-demo-pass'}, ...options});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const baseURL = `http://127.0.0.1:${address.port}`;
  t.after(async () => {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await rm(directory, {recursive: true, force: true});
  });
  return {server, baseURL, directory};
}

async function json(baseURL, path, options = {}) {
  const response = await fetch(new URL(path, baseURL), options);
  return {response, body: await response.json()};
}

const postJSON = (body, cookie) => ({method: 'POST', headers: {'content-type': 'application/json', ...(cookie ? {cookie} : {})}, body: JSON.stringify(body)});

test('admin API authenticates, protects resources, and clears session cookies', async t => {
  const {baseURL} = await startServer(t);
  const health = await json(baseURL, '/api/health');
  assert.equal(health.response.status, 200);
  assert.equal(health.body.status, 'ok');

  const denied = await json(baseURL, '/api/dashboard');
  assert.equal(denied.response.status, 401);

  const invalid = await json(baseURL, '/api/auth/login', postJSON({username: 'owner', password: 'wrong'}));
  assert.equal(invalid.response.status, 401);

  const login = await json(baseURL, '/api/auth/login', postJSON({username: 'owner', password: 'secure-demo-pass'}));
  assert.equal(login.response.status, 200);
  const cookie = login.response.headers.get('set-cookie').split(';')[0];
  const identity = await json(baseURL, '/api/auth/me', {headers: {cookie}});
  assert.equal(identity.body.user.username, 'owner');
  const logout = await json(baseURL, '/api/auth/logout', postJSON({}, cookie));
  assert.match(logout.response.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await json(baseURL, '/api/auth/me', {headers: {cookie}})).response.status, 401);
});

test('resource API validates CRUD, search, status filters, and pagination', async t => {
  const {baseURL} = await startServer(t);
  const login = await json(baseURL, '/api/auth/login', postJSON({username: 'owner', password: 'secure-demo-pass'}));
  const cookie = login.response.headers.get('set-cookie').split(';')[0];
  const headers = {cookie, 'content-type': 'application/json'};

  const invalid = await json(baseURL, '/api/customers', {method: 'POST', headers, body: JSON.stringify({email: 'not-an-email'})});
  assert.equal(invalid.response.status, 400);

  const created = await json(baseURL, '/api/customers', {method: 'POST', headers, body: JSON.stringify({name: 'Rae Park', email: 'rae@studio.example', company: 'Studio Rae', status: 'active', joinedAt: '2026-09-23'})});
  assert.equal(created.response.status, 201);
  const id = created.body.data.id;

  const list = await json(baseURL, '/api/customers?page=1&perPage=2&q=rae&status=active', {headers});
  assert.equal(list.body.total, 1);
  assert.equal(list.body.data[0].id, id);

  const updated = await json(baseURL, `/api/customers/${id}`, {method: 'PATCH', headers, body: JSON.stringify({company: 'Rae Studio'})});
  assert.equal(updated.body.data.company, 'Rae Studio');

  const summary = await json(baseURL, '/api/dashboard', {headers});
  assert.equal(summary.body.customers, 6);
  assert.ok(summary.body.revenue > 0);

  const deleted = await json(baseURL, `/api/customers/${id}`, {method: 'DELETE', headers});
  assert.equal(deleted.response.status, 200);
  assert.equal((await json(baseURL, `/api/customers/${id}`, {headers})).response.status, 404);
});

test('backend serves dashboard and Teptop runtime modules', async t => {
  const {baseURL} = await startServer(t);
  const page = await fetch(baseURL);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.match(await page.text(), /Fieldnote Admin/);
  const runtime = await fetch(`${baseURL}/runtime/index.js`);
  assert.equal(runtime.status, 200);
  assert.match(await runtime.text(), /export function signal/);
});
