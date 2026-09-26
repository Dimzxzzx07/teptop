import assert from 'node:assert/strict';
import test from 'node:test';
import {createEmitter, createHttpClient, createQueryClient, schema, ValidationError} from '../src/index.js';

test('event emitter supports once, wildcard listeners, and history', () => {
  const bus = createEmitter({history: true});
  const seen = [];
  bus.on('task', payload => seen.push(['task', payload]));
  bus.once('task', payload => seen.push(['once', payload]));
  bus.on('*', (payload, record) => seen.push([record.event, payload]));
  bus.emit('task', {id: 1});
  bus.emit('task', {id: 2});
  assert.deepEqual(seen, [['task', {id: 1}], ['once', {id: 1}], ['task', {id: 1}], ['task', {id: 2}], ['task', {id: 2}]]);
  assert.equal(bus.listenerCount('task'), 1);
  assert.equal(bus.history().length, 2);
  bus.clear('task');
  assert.equal(bus.listenerCount('*'), 1);
});

test('http client applies query, JSON body, and interceptors', async () => {
  const calls = [];
  const client = createHttpClient({
    baseURL: 'https://api.test',
    fetch: async (url, config) => {
      calls.push({url: url.href, config});
      return {ok: true, status: 200, headers: {get: () => 'application/json'}, json: async () => ({received: JSON.parse(config.body), path: url.pathname})};
    },
  });
  client.use({request: ({config}) => ({...config, headers: {...config.headers, 'x-test': 'yes'}}), response: data => ({...data, intercepted: true})});
  const result = await client.post('/users', {name: 'Ada'}, {query: {active: true}});
  assert.deepEqual(result, {received: {name: 'Ada'}, path: '/users', intercepted: true});
  assert.equal(calls[0].url, 'https://api.test/users?active=true');
  assert.equal(calls[0].config.headers['x-test'], 'yes');
});

test('query client caches ready data and exposes reactive state', async () => {
  let calls = 0;
  const queries = createQueryClient({staleTime: 1000});
  const users = queries.query(['users', 1], async () => { calls++; return ['Ada']; });
  assert.equal(users.state().status, 'idle');
  await users.refetch();
  await users.refetch();
  assert.deepEqual(users.data(), ['Ada']);
  assert.equal(users.loading(), false);
  assert.equal(calls, 1);
  assert.deepEqual(queries.dehydrate(), {'["users",1]': ['Ada']});
});

test('schema validation reports paths and supports safe parsing', () => {
  const user = schema.object({name: schema.string(), age: schema.number().optional()});
  assert.deepEqual(user.parse({name: 'Ada'}), {name: 'Ada'});
  const result = user.safeParse({name: 42});
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues[0].path, ['name']);
  assert.throws(() => user.parse({name: null}), ValidationError);
});
