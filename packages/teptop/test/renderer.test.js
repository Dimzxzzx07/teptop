import assert from 'node:assert/strict';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {Fragment, createComponent, h, hydrate, render, signal, useEffect} from '../src/index.js';
import {toHTML} from '../src/server.js';

async function withDocument(markup, work) {
  const dom = new JSDOM(`<!doctype html><main id="app">${markup}</main>`);
  const previous = globalThis.document;
  globalThis.document = dom.window.document;
  try { return await work(dom.window.document.querySelector('#app'), dom.window); }
  finally { globalThis.document = previous; dom.window.close(); }
}

const tick = () => new Promise(resolve => queueMicrotask(resolve));

test('fragments preserve child DOM structure without wrapper elements', () => withDocument('', target => {
  const app = render(() => h('div', null, h(Fragment, null, h('span', null, 'one'), h('span', null, 'two'))), target);
  const parent = target.querySelector('div');
  assert.deepEqual([...parent.children].map(element => element.textContent), ['one', 'two']);
  assert.equal(parent.querySelector('span span'), null);
  app.destroy();
}));

test('keyed children move existing nodes and preserve their identity', async () => withDocument('', async target => {
  const order = signal(['a', 'b', 'c']);
  const app = render(() => h('ul', null, order().map(key => h('li', {key, id: key}, key))), target);
  const original = Object.fromEntries([...target.querySelectorAll('li')].map(element => [element.id, element]));
  order.set(['c', 'a', 'b']);
  await tick();
  assert.deepEqual([...target.querySelectorAll('li')].map(element => element.id), ['c', 'a', 'b']);
  for (const [id, element] of Object.entries(original)) assert.strictEqual(target.querySelector(`#${id}`), element);
  app.destroy();
}));

test('keyed fragment ranges move as a unit without losing descendant nodes', async () => withDocument('', async target => {
  const order = signal(['alpha', 'beta']);
  const app = render(() => h('main', null, order().map(group => h(Fragment, {key: group},
    h('i', {id: `${group}-start`}, group),
    h('b', {id: `${group}-end`}, '!'),
  ))), target);
  const alpha = target.querySelector('#alpha-start');
  const beta = target.querySelector('#beta-start');
  order.set(['beta', 'alpha']);
  await tick();
  assert.deepEqual([...target.querySelectorAll('i')].map(element => element.id), ['beta-start', 'alpha-start']);
  assert.strictEqual(target.querySelector('#alpha-start'), alpha);
  assert.strictEqual(target.querySelector('#beta-start'), beta);
  assert.equal(target.querySelector('#alpha-end').previousElementSibling, alpha);
  app.destroy();
}));

test('controlled input properties and SVG namespace are updated', async () => withDocument('', async target => {
  const value = signal('initial');
  const checked = signal(false);
  const app = render(() => h(Fragment, null,
    h('input', {value: value(), checked: checked()}),
    h('svg', {viewBox: '0 0 10 10', style: {opacity: 0.5, width: 20}}, h('path', {d: 'M0 0'})),
  ), target);
  const input = target.querySelector('input');
  assert.equal(input.value, 'initial');
  assert.equal(input.checked, false);
  value.set('updated');
  checked.set(true);
  await tick();
  assert.equal(input.value, 'updated');
  assert.equal(input.checked, true);
  assert.equal(target.querySelector('svg').namespaceURI, 'http://www.w3.org/2000/svg');
  assert.equal(target.querySelector('svg').style.opacity, '0.5');
  assert.equal(target.querySelector('svg').style.width, '20px');
  assert.equal(target.querySelector('path').namespaceURI, 'http://www.w3.org/2000/svg');
  app.destroy();
}));

test('event handlers update and are removed on renderer teardown', async () => withDocument('', async (target, window) => {
  const alternate = signal(false);
  let firstCalls = 0;
  let secondCalls = 0;
  const app = render(() => h('button', {onclick: () => alternate() ? secondCalls++ : firstCalls++}, 'Run'), target);
  const button = target.querySelector('button');
  button.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(firstCalls, 1);
  alternate.set(true);
  await tick();
  button.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(firstCalls, 1);
  assert.equal(secondCalls, 1);
  app.destroy();
  button.dispatchEvent(new window.MouseEvent('click'));
  assert.equal(secondCalls, 1);
}));

test('component effect cleanup runs when its rendered branch is removed', async () => withDocument('', async target => {
  let cleanups = 0;
  const visible = signal(true);
  const Panel = createComponent(() => {
    useEffect(() => () => { cleanups++; }, []);
    return h('aside', null, 'panel');
  });
  const app = render(() => h('section', null, visible() ? h(Panel) : null), target);
  assert.ok(target.querySelector('aside'));
  visible.set(false);
  await tick();
  assert.equal(target.querySelector('aside'), null);
  assert.equal(cleanups, 1);
  visible.set(true);
  await tick();
  assert.ok(target.querySelector('aside'));
  visible.set(false);
  await tick();
  assert.equal(cleanups, 2);
  app.destroy();
  assert.equal(cleanups, 2);
}));

test('hydration reuses server nodes and attaches events without duplicating markup', () => withDocument('', async (target, window) => {
  const count = signal(0);
  const view = () => h('button', {id: 'counter', onclick: () => count.update(value => value + 1)}, `Count ${count()}`);
  target.innerHTML = toHTML(view());
  const serverButton = target.querySelector('#counter');
  const app = hydrate(view, target);
  assert.strictEqual(target.querySelector('#counter'), serverButton);
  assert.equal(target.querySelectorAll('#counter').length, 1);
  serverButton.dispatchEvent(new window.MouseEvent('click', {bubbles: true}));
  assert.equal(count(), 1);
  await tick();
  assert.strictEqual(target.querySelector('#counter'), serverButton);
  assert.equal(serverButton.textContent, 'Count 1');
  app.render(() => h('p', null, 'client replacement'));
  assert.equal(target.textContent, 'client replacement');
  app.unmount();
  assert.equal(target.childNodes.length, 0);
}));

test('hydration rejects structural mismatch with an actionable error', () => withDocument('<p>server</p>', target => {
  assert.throws(() => hydrate(() => h('section', null, 'client'), target), error => error.name === 'HydrationMismatchError' && /section|p/.test(error.message));
  assert.equal(target.querySelectorAll('p').length, 1);
  assert.equal(target.querySelectorAll('section').length, 0);
}));

test('SSR fragment and adjacent text boundaries hydrate without replacing elements', () => withDocument('', async (target, window) => {
  const label = signal('Ada');
  const view = () => h(Fragment, null, 'Hello ', label(), h('button', {id: 'reuse'}, 'Go'));
  target.innerHTML = toHTML(view());
  const button = target.querySelector('#reuse');
  const app = hydrate(view, target);
  assert.strictEqual(target.querySelector('#reuse'), button);
  assert.deepEqual([...target.childNodes].filter(node => node.nodeType === 1).map(node => node.id), ['reuse']);
  label.set('Grace');
  await tick();
  assert.strictEqual(target.querySelector('#reuse'), button);
  assert.equal(target.textContent, 'Hello GraceGo');
  app.unmount();
}));
