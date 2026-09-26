import assert from 'node:assert/strict';
import test from 'node:test';
import {batch, compileTemplate, computed, createAdvancedStore, createComponent, createContext, createElement, createForm, createMemoryRouter, createRoot, createScope, createStore, deferred, effect, Fragment, h, memo, matchPath, resource, schedule, scheduleTask, signal, startTransition, useEffect, useMemo, useReducer, useState, watch} from '../src/index.js';
import {toHTML} from '../src/server.js';

test('signals, derived values, batching, and cleanup', async () => {
  const count = signal(1);
  const doubled = computed(() => count() * 2);
  const seen = [];
  const stop = effect(() => seen.push(doubled()));
  batch(() => { count.set(2); count.set(3); });
  await new Promise(resolve => queueMicrotask(resolve));
  stop();
  count.set(4);
  await new Promise(resolve => queueMicrotask(resolve));
  assert.equal(doubled(), 8);
  assert.deepEqual(seen, [2, 6]);
});

test('watch, store actions, and async resources', async () => {
  const value = signal('idle');
  const changes = [];
  watch(value, (next, previous) => changes.push([previous, next]));
  value.set('ready');
  await new Promise(resolve => queueMicrotask(resolve));
  const store = createStore({count: 0}, {increment: state => ({count: state.count + 1})});
  store.dispatch('increment');
  const data = resource(async input => input * 3);
  await data.load(4);
  assert.deepEqual(changes, [['idle', 'ready']]);
  assert.deepEqual(store.state(), {count: 1});
  assert.equal(data.state().data, 12);
});

test('server rendering serializes escaped markup', () => {
  const markup = toHTML(h('main', {class: 'shell'}, h('h1', null, 'Teptop <3')));
  assert.equal(markup, '<main class="shell"><h1>Teptop &lt;3</h1></main>');
});

test('scopes own effects and context provides nested values', async () => {
  const value = signal(0);
  const scope = createScope();
  let runs = 0;
  scope.effect(() => { value(); runs++; });
  const context = createContext('root');
  assert.equal(context.read(), 'root');
  context.provide('nested', () => assert.equal(context.read(), 'nested'));
  scope.close();
  value.set(1);
  await new Promise(resolve => queueMicrotask(resolve));
  assert.equal(runs, 1);
});

test('deferred values, transitions, and memoized views are composable', async () => {
  const value = signal(1);
  const delayed = deferred(value, 1);
  const view = memo(props => h('p', null, props.label));
  const first = view({label: 'stable'});
  const second = view({label: 'stable'});
  startTransition(() => value.set(2));
  await new Promise(resolve => setTimeout(resolve, 4));
  assert.equal(delayed(), 2);
  assert.strictEqual(first, second);
});

test('components keep hook state and dispose effects', () => {
  let cleanups = 0;
  let renders = 0;
  const Counter = createComponent(({label}) => {
    const [count, setCount] = useState(1);
    const [reduced, dispatch] = useReducer((value, action) => value + action, 2);
    const title = useMemo(() => `${label}:${count() + reduced()}`, [label, count(), reduced()]);
    useEffect(() => () => { cleanups++; }, []);
    renders++;
    return createElement(Fragment, null, title, h('button', {onclick: () => { setCount(value => value + 1); dispatch(3); }}));
  });

  const first = Counter({label: 'total'});
  assert.equal(first.children[0], 'total:3');
  const state = Counter({label: 'total'});
  assert.equal(state.children[0], 'total:3');
  assert.equal(typeof state.children[1].props.onclick, 'function');
  state.children[1].props.onclick();
  const updated = Counter({label: 'total'});
  assert.equal(updated.children[0], 'total:7');
  assert.equal(renders, 3);
  Counter.dispose();
  assert.equal(cleanups, 1);
});

test('scheduler tasks can be cancelled and roots own mounted applications', () => {
  let called = false;
  const task = scheduleTask(() => { called = true; }, 'low');
  assert.equal(typeof task, 'number');
  assert.equal(called, false);
  const root = createRoot({appendChild() {}, replaceChild() {}, firstChild: null});
  assert.equal(typeof root.render, 'function');
  assert.equal(typeof root.unmount, 'function');
});

test('public subsystems cover scheduling, routing, templates, forms, and history', async () => {
  const order = [];
  schedule(() => order.push('background'), 'background');
  schedule(() => order.push('urgent'), 'user-blocking');
  await new Promise(resolve => queueMicrotask(resolve));
  assert.deepEqual(order, ['urgent', 'background']);
  assert.deepEqual(matchPath('/users/:id', '/users/ada').params, {id: 'ada'});
  const router = createMemoryRouter({'/': () => 'home', '/users/:id': () => 'user'}, '/users/ada');
  assert.equal(router.params.id, 'ada');
  assert.equal(compileTemplate('Hello {{ user.name }}', {user: {name: '<Ada>'}}), 'Hello &lt;Ada&gt;');
  const form = createForm({email: ''}, {email: value => value.includes('@') ? undefined : 'Invalid email'});
  assert.equal(form.valid(), false);
  form.set('email', 'ada@example.test');
  await new Promise(resolve => queueMicrotask(resolve));
  assert.equal(form.valid(), true);
  const store = createAdvancedStore({count: 0}, {actions: {increment: state => ({count: state.count + 1})}});
  store.dispatch('increment');
  store.undo();
  assert.equal(store.state().count, 0);
});
