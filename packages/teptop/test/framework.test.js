import assert from 'node:assert/strict';
import test from 'node:test';
import {createApp, createCollection, createPipeline, definePlugin} from '../src/index.js';

test('application plugins provide services and clean up in reverse order', () => {
  const events = [];
  const first = definePlugin(app => {
    app.provide('feature', 'enabled');
    events.push('install:first');
    return () => events.push('cleanup:first');
  });
  const second = app => {
    app.on('ready', () => events.push('ready'));
    events.push('install:second');
    return () => events.push('cleanup:second');
  };
  const app = createApp({name: 'test-app', plugins: [first, second]});
  app.emit('ready');
  assert.equal(app.inject('feature'), 'enabled');
  assert.deepEqual(events, ['install:first', 'install:second', 'ready']);
  app.destroy();
  assert.deepEqual(events, ['install:first', 'install:second', 'ready', 'cleanup:second', 'cleanup:first']);
});

test('middleware pipeline composes context and recovers errors', async () => {
  const order = [];
  const pipeline = createPipeline();
  pipeline.before(context => ({...context, requestId: 'req-1'}));
  pipeline.use(async (context, next) => { order.push('auth'); context.authorized = true; return next(); });
  pipeline.use(async (context, next) => { order.push('handler'); context.result = 'ok'; return next(); });
  pipeline.after(context => ({...context, complete: true}));
  const result = await pipeline.run({input: 1}, async context => ({...context, terminal: true}));
  assert.deepEqual(result, {input: 1, requestId: 'req-1', authorized: true, result: 'ok', terminal: true, complete: true});
  assert.deepEqual(order, ['auth', 'handler']);

  const failure = createPipeline();
  failure.use(() => { throw new Error('broken'); });
  assert.rejects(failure.run(), /broken/);
});

test('collection supports query, sorting, selection, mutation, and loading', async () => {
  const collection = createCollection([{id: 1, name: 'Ada'}, {id: 2, name: 'Linus'}]);
  collection.setQuery('ada');
  await new Promise(resolve => queueMicrotask(resolve));
  assert.deepEqual(collection.visible(), [{id: 1, name: 'Ada'}]);
  collection.setQuery('').sortBy((left, right) => right.id - left.id).select(2);
  await new Promise(resolve => queueMicrotask(resolve));
  assert.deepEqual(collection.visible().map(item => item.id), [2, 1]);
  assert.deepEqual(collection.selected(), [2]);
  collection.update(2, {name: 'Grace'});
  collection.remove(1);
  await new Promise(resolve => queueMicrotask(resolve));
  assert.deepEqual(collection.items(), [{id: 2, name: 'Grace'}]);
  await collection.load(async () => [{id: 3, name: 'Guido'}]);
  assert.equal(collection.status(), 'ready');
  assert.deepEqual(collection.items(), [{id: 3, name: 'Guido'}]);
});
