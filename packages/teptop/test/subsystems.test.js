import assert from 'node:assert/strict';
import test from 'node:test';
import {compileView, parseAttributes} from '../src/compiler.js';
import {devtools, trace} from '../src/devtools.js';
import {createForm} from '../src/forms.js';
import {createMemoryRouter, matchPath} from '../src/router.js';
import {pendingCount, schedule, scheduleSync} from '../src/scheduler.js';

test('compiler and router utilities are deterministic', () => {
  assert.equal(compileView('{{greeting}}, {{name}}')({greeting: 'Hi', name: 'Ada'}), 'Hi, Ada');
  assert.deepEqual(parseAttributes('type="email" required'), {type: 'email', required: true});
  assert.deepEqual(matchPath('/files/*', '/files/a/b').params, {wildcard: 'a/b'});
  assert.equal(createMemoryRouter({'/': 'home'}).path, '/');
});

test('scheduler and devtools expose inspection hooks', async () => {
  const order = [];
  scheduleSync(() => order.push('sync'));
  schedule(() => order.push('normal'));
  assert.equal(pendingCount(), 1);
  await new Promise(resolve => queueMicrotask(resolve));
  const tool = devtools('test');
  trace('sample', () => order.push('trace'), tool);
  assert.deepEqual(order, ['sync', 'normal', 'trace']);
  assert.equal(tool.snapshot().length, 1);
});

test('form submit blocks invalid values', async () => {
  const form = createForm({name: ''}, {name: value => value ? undefined : 'Required'});
  assert.equal(form.submit(() => {}), false);
  form.set('name', 'Ada');
  await new Promise(resolve => queueMicrotask(resolve));
  assert.equal(form.submit(() => {}), true);
});
