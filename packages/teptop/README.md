# Teptop.js

A signal-first UI runtime and application toolkit for modern JavaScript.

Teptop combines fine-grained reactive state, a small DOM renderer, and modular application services.

The runtime is written as native ECMAScript modules.

It does not require JSX, a compiler, or a virtual-DOM package.

Views are ordinary JavaScript values created with `h()`.

Reactive values are explicit signals created with `signal()`.

Derived values are declared with `computed()`.

Side effects are scoped with `effect()` and stopped with the disposer it returns.

This README documents the public package surface and practical usage patterns.

Examples target Node.js 20 or newer unless a section explicitly says browser.

## Contents

- [Highlights](#highlights)
- [Requirements](#requirements)
- [Installation](#installation)
- [First browser view](#first-browser-view)
- [First server render](#first-server-render)
- [Package exports](#package-exports)
- [Reactivity model](#reactivity-model)
- [Signals](#signals)
- [Computed values](#computed-values)
- [Effects and watches](#effects-and-watches)
- [Batching and transitions](#batching-and-transitions)
- [Views and elements](#views-and-elements)
- [DOM rendering](#dom-rendering)
- [Components and hooks](#components-and-hooks)
- [Lifecycle and context](#lifecycle-and-context)
- [Stores](#stores)
- [Async resources](#async-resources)
- [Routing](#routing)
- [Scheduling](#scheduling)
- [Forms](#forms)
- [Events](#events)
- [HTTP](#http)
- [Queries and caching](#queries-and-caching)
- [Validation](#validation)
- [Applications and plugins](#applications-and-plugins)
- [Middleware pipelines](#middleware-pipelines)
- [Collections](#collections)
- [Templates and compiler utilities](#templates-and-compiler-utilities)
- [Server serialization](#server-serialization)
- [Testing](#testing)
- [Devtools](#devtools)
- [TypeScript](#typescript)
- [Security notes](#security-notes)
- [Common patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)
- [API index](#api-index)
- [Notes and important guidance](#notes-and-important-guidance)

## Highlights

- Fine-grained signals with synchronous reads.
- Derived values that update when their dependencies change.
- Effects with dependency tracking and cleanup.
- Batching for related state transitions.
- A DOM renderer with event properties and refs.
- Plain-object views that can be rendered in a browser or serialized on a server.
- Components with persistent hook state.
- Stores with named actions and optional undo/redo history.
- Async resources with stale-response protection.
- Browser and memory routers.
- Forms, validation schemas, HTTP clients, and query caching.
- Event emitters and event-backed state containers.
- Middleware pipelines for application and request workflows.
- Reactive collections for filtering and selection.
- Explicit teardown APIs for roots, effects, scopes, plugins, and routers.
- Separate import paths for commonly used subsystems.

## Requirements

- Node.js 20 or newer for package scripts and server-side use.
- A modern browser for DOM rendering.
- Native ES module support.
- `structuredClone` for store and collection cloning.
- `queueMicrotask` for coalesced reactive updates.
- `fetch` for HTTP use unless a custom implementation is injected.
- A DOM implementation when rendering or hydrating in a browser.

Teptop does not bundle a browser, DOM implementation, or development server.

A bundler such as Vite is optional and is only needed when your app uses bare npm imports in a browser.

You can also use a browser import map or a deployment process that resolves npm modules.

## Installation

Install the runtime from npm:

```sh
npm install teptop.js
```

The package is ESM-first.

Use `import` statements from JavaScript modules.

```js
import {signal, computed, effect} from 'teptop.js';
```

For TypeScript, package declarations are exposed from the root export.

```ts
import {signal, computed} from 'teptop.js';
```

Check the `engines` field if selecting a Node.js runtime for server scripts.

The package currently declares Node.js `>=20`.

Install only the submodules your application needs at the source level.

Subpath exports resolve to files inside the same `teptop.js` package.

They are not separate npm packages.

```js
import {createForm} from 'teptop.js/forms';
import {toHTML} from 'teptop.js/server';
```

### Optional companion packages

`@teptop/server` is a separately published companion package.

`@teptop/web` is a separately published companion package.

`teptop-cli` is a separately published command-line package.

They are not required to use the core runtime.

Choose a version that is actually published and compatible with your release plan.

The core package's own development dependencies are used for repository development.

They are not automatically installed as dependencies by downstream consumers.

## First browser view

The smallest reactive browser example uses `signal`, `h`, and `render`.

```js
import {h, render, signal} from 'teptop.js';

const count = signal(0);
const target = document.querySelector('#app');

const root = render(() => h('button', {
  onclick: () => count.update(value => value + 1),
}, `Count: ${count()}`), target);

window.addEventListener('beforeunload', () => root.destroy(), {once: true});
```

Create a target element before calling `render`.

The render function must run in an environment with `document`.

The supplied view can be a function that reads signals.

Reads performed while the view is normalized are tracked by the renderer effect.

When a tracked signal changes, Teptop schedules a view update.

The update is coalesced with other reactive work in a microtask.

The returned root has an `element()` method.

The returned root has a `destroy()` method.

Call `destroy()` when the rendered region is no longer needed.

## First server render

Create the same plain view shape and serialize it with `toHTML()`.

```js
import {h} from 'teptop.js';
import {toHTML} from 'teptop.js/server';

const view = h('main', {class: 'page'},
  h('h1', null, 'Hello from Teptop'),
  h('p', null, 'This markup was serialized on the server.'),
);

console.log(toHTML(view));
```

`toHTML()` escapes text and attribute values.

It does not execute browser event handlers.

It omits `on*`, `key`, and `ref` properties from serialized attributes.

Use the serializer for markup, not as a replacement for a complete web server.

## Package exports

The package root is `teptop.js`.

The root export contains the primary runtime and re-exports the application subsystems.

`teptop.js/server` exposes server-safe view serialization.

`teptop.js/scheduler` exposes scheduler functions.

`teptop.js/store` exposes store helpers.

`teptop.js/router` exposes route matching and memory routing.

`teptop.js/compiler` exposes template and attribute utilities.

`teptop.js/forms` exposes form state.

`teptop.js/devtools` exposes inspection helpers.

`teptop.js/testing` exposes a DOM-backed test renderer.

`teptop.js/events` exposes event utilities.

`teptop.js/http` exposes the HTTP client and error type.

`teptop.js/query` exposes the query cache.

`teptop.js/validation` exposes schemas and validation.

`teptop.js/application` exposes application and plugin helpers.

`teptop.js/pipeline` exposes middleware pipelines.

`teptop.js/data` exposes reactive collections.

Use root imports when an application already imports core runtime functions.

Use subpath imports when you want a clear module boundary.

Import paths are case-sensitive on many deployment systems.

Do not import private source paths that are not listed in `exports`.

## Reactivity model

A signal stores one current value.

Calling the signal reads its current value.

Calling `.set()` or `.update()` changes that value.

A computed signal derives a value from other signals.

An effect runs code that depends on signals.

Dependencies are discovered while an effect is executing.

The dependency graph is refreshed each time the effect re-runs.

The first effect execution is synchronous.

Subsequent notifications are scheduled using `queueMicrotask`.

Repeated writes before the queue flush are coalesced by subscriber identity.

The same effect will not be run once per write in a batch.

Teptop does not require a component tree for signals to work.

Signals can be used in modules, event handlers, stores, and service objects.

Effects should be used for side effects, not as a general-purpose derived-value container.

Use `computed()` for values that are only a derivation.

Use `batch()` when several related signals should become visible together.

Use `flushSync()` only when integration code needs pending reactive jobs completed now.

### Reactive update sequence

A direct read returns the current value immediately.

A write updates the stored value immediately.

A write notifies subscribers if the new value is not `Object.is` equal to the old value.

The subscriber job is queued for a microtask unless a batch is active.

The scheduler snapshots pending jobs before running them.

Jobs added during a flush can schedule another flush.

A synchronous callback can therefore read a newly written signal before effects rerun.

An effect callback observes a later scheduled pass after a normal write.

Use a microtask wait in tests when asserting scheduled effects.

Use `flushSync()` when a test requires deterministic immediate updates.

## Signals

Create a signal with an initial value.

```js
import {signal} from 'teptop.js';

const name = signal('Ada');
console.log(name());
name.set('Grace');
console.log(name());
```

The signal itself is a callable read function.

Calling `name()` returns the current value.

Calling `name.set(value)` replaces the value.

Calling `name.set(updater)` passes the current value to the updater.

Calling `name.update(updater)` is an alias for the updater form of `set`.

Calling `name.peek()` reads without subscribing the active effect.

Calling `name.subscribe(listener)` registers a direct subscriber.

The subscription call returns an unsubscribe function.

A direct subscriber receives no arguments.

Direct subscribers are notified when the signal value changes.

Signal writes return the resolved new value.

A write to an `Object.is` equal value does not notify subscribers.

Signals do not clone objects automatically.

When storing objects, prefer immutable replacement to make state transitions explicit.

```js
const user = signal({name: 'Ada', active: true});
user.update(current => ({...current, active: false}));
```

Mutating `user().active` in place does not notify subscribers.

Replace the object or use a store helper that creates a new object.

A signal can hold `undefined` if that is a valid part of your model.

A signal can hold arrays, objects, primitives, and class instances.

Use a discriminated object when several related fields form one state machine.

```js
const request = signal({status: 'idle', data: undefined, error: undefined});
```

Use separate signals when values have independent lifecycles.

Use `peek()` inside an event path when tracking would be inappropriate.

Avoid placing side effects inside an updater function.

Updaters should calculate and return the next value.

### Signal API reference

`signal(initialValue)` creates a new signal.

`signal()` reads the current value.

`signal.set(value)` stores a value.

`signal.set(updater)` computes a value from the current value.

`signal.update(updater)` updates from the current value.

`signal.peek()` reads without tracking.

`signal.subscribe(listener)` registers a listener.

The unsubscribe callback removes that listener.

Signal equality is based on `Object.is`.

### Signal example: form field

```js
const email = signal('');
const touched = signal(false);

function onInput(event) {
  email.set(event.currentTarget.value);
}

function onBlur() {
  touched.set(true);
}
```

The input event updates the value synchronously.

An effect depending on `email` runs after the pending microtask.

The UI renderer can track `email()` when constructing a view.

### Signal example: toggle

```js
const enabled = signal(false);

enabled.update(value => !value);
```

A boolean signal is useful for a local toggle.

A boolean signal is not a permission boundary.

Always enforce authorization in the trusted server layer.

### Signal example: immutable list

```js
const todos = signal([]);

todos.update(items => [...items, {id: 1, title: 'Read the guide'}]);
```

Array replacement notifies dependents.

Mutating `todos().push(item)` does not trigger a write.

For richer filtering and selection use `createCollection()`.

## Computed values

Create a computed value from a derivation function.

```js
import {computed, signal} from 'teptop.js';

const price = signal(12);
const quantity = signal(3);
const total = computed(() => price() * quantity());

console.log(total());
```

`computed()` returns a signal-like read function.

Dependencies are collected when its internal effect executes.

The initial derivation executes when the computed is created.

A dependency change schedules recomputation.

The computed's output only notifies dependents if its value changes.

Computed values are appropriate for totals, selectors, and derived labels.

A computed callback should be deterministic and free of side effects.

Do not call `set()` on another application signal from a derivation.

Do not use a computed as a command handler.

Computed values currently use an internal effect and expose no disposer.

Keep computed signals scoped to a sensible application lifetime.

Prefer building one clear derivation over long chains of duplicated effects.

```js
const fullName = computed(() => `${firstName()} ${lastName()}`);
```

A computed can depend on other computed values.

A computed can branch on signals; the dependency set is refreshed per run.

A computed reads synchronously when called.

An asynchronous derivation is not awaited by `computed()`.

Use `resource()` or `createQueryClient()` for asynchronous data.

### Computed value checklist

Read dependencies by calling their getter functions.

Return the derived value from the callback.

Do not modify the result after reading it.

Return a new object if consumers depend on object identity.

Keep expensive work out of frequently changing derivations.

Use memoization only when it is needed by your domain logic.

Test derived values after waiting for a scheduled update when dependencies changed.

## Effects and watches

Effects execute immediately once when created.

Signal reads inside the callback become dependencies.

The callback can return a cleanup function.

Cleanup runs before the next callback execution.

Cleanup runs when the disposer is called.

```js
import {effect, signal} from 'teptop.js';

const query = signal('');
const stop = effect(() => {
  console.log('query:', query());
});

query.set('signals');
stop();
```

The first `console.log` happens synchronously.

The later log runs in a queued update pass.

Calling `stop()` prevents future executions.

An effect should be stopped when its owner is disposed.

Effects are suitable for logging, subscriptions, and imperative integrations.

Effects are not needed merely to compute a value for the view.

Use `computed()` instead of writing derived state from an effect.

### Effect cleanup

Return a function to release work from the current effect run.

```js
const stop = effect(() => {
  const id = selectedId();
  const subscription = subscribeToRecord(id);
  return () => subscription.unsubscribe();
});
```

Cleanup runs before a rerun.

Cleanup runs exactly as part of stopping the effect.

A cleanup should be safe to call once.

If setup can fail, clean up partially acquired resources in the setup code.

Do not assume effects run in a browser-only context.

Guard DOM access or create the effect only in browser code.

### Watch a signal

`watch(source, callback, options)` is a convenience over `effect()`.

The callback receives the next value and the previous value.

The first callback is skipped by default.

Set `{immediate: true}` to call the callback on the first run.

```js
const stop = watch(count, (next, previous) => {
  console.log(`${previous} -> ${next}`);
});
```

Watch callbacks run as part of the tracking effect.

The watched source can be a signal-like function.

The current TypeScript declaration describes a `Signal<T>` source.

The returned value is a disposer.

Stop a watcher when its owner is destroyed.

### Effects versus watches

Use `effect()` when the callback itself reads dependencies.

Use `watch()` when you want old and new values for one source.

Use `computed()` when you need a reusable derived value.

Use a store action when a user event causes a state transition.

Avoid hidden writes that make dependency direction difficult to understand.

### Effect testing

The first effect pass is synchronous.

A standard signal update schedules later passes.

Use `await new Promise(resolve => queueMicrotask(resolve))` for one microtask boundary.

Use `flushSync()` to drain pending signal subscribers synchronously.

Do not rely on arbitrary long timeouts for ordinary signal assertions.

Use timer controls only for APIs that actually use timers.

## Batching and transitions

`batch(work)` defers reactive subscriber flushing until the work completes.

Writes inside the callback still update signal values immediately.

Subscribers are coalesced while the batch is active.

The callback's return value is returned by `batch()`.

```js
import {batch, signal} from 'teptop.js';

const first = signal(0);
const second = signal(0);

batch(() => {
  first.set(1);
  second.set(2);
});
```

Use a batch for one logical user action affecting multiple state values.

Do not use a batch to hide unrelated mutations.

Nested batches are supported by a counter.

The outermost completion schedules pending work.

A thrown error still decrements the active batch count.

`startTransition(work)` currently wraps the work in a batch.

It also tracks a transition depth internally.

Do not assume it implements time slicing or background rendering.

`flushSync(work)` executes optional work and drains pending jobs synchronously.

Use `flushSync()` sparingly at integration boundaries.

A flush can run more than one wave if jobs enqueue more jobs.

### When to batch

Batch a coordinated store update.

Batch multiple independent signal writes from one event.

Batch a reset that clears related state.

Batch updates that should produce one reactive pass.

Do not batch a long-running asynchronous operation.

Do not expect a batch to make network requests transactional.

Do not expect a batch to roll back on error.

## Views and elements

`h(tag, props, ...children)` creates a plain Teptop view node.

The node has `tag`, `props`, and `children` fields.

Nested child arrays are flattened.

`createElement` is an alias for `h`.

`Fragment` is represented by the string `teptop-fragment`.

```js
import {Fragment, h} from 'teptop.js';

const view = h('section', {class: 'profile'},
  h('h1', null, 'Ada Lovelace'),
  h(Fragment, null,
    h('p', null, 'Mathematician'),
    h('p', null, 'Writer'),
  ),
);
```

Children can be strings, numbers, nodes, arrays, booleans, or nullish values.

Falsy boolean and nullish children are normalized as empty nodes.

A function tag is invoked as a component during normalization.

A string tag becomes a DOM element during browser rendering.

Props are ordinary object properties.

The renderer maps `className` to the `class` attribute.

The renderer supports object-valued `style` by assigning style properties.

Properties starting with `on` are registered as DOM event listeners.

Use lowercase event props such as `onclick` and `oninput`.

Use `ref` for an object whose `current` field should reference an element.

The `key` property is used by child reconciliation.

Do not expect JSX syntax unless a separate compile step is configured.

Teptop's core package does not require JSX.

### Element property behavior

A `true` property becomes a present empty attribute.

A `false` or nullish property removes the attribute.

A string or number becomes an attribute value.

Event handlers are attached with `addEventListener`.

The event name is the `on` suffix lowercased.

When an event handler changes during patching, the previous handler is removed.

The renderer does not interpret every DOM property as a native property assignment.

For controlled inputs, verify attribute and value behavior in the target browser.

Use safe text nodes for user-provided content.

Avoid inserting untrusted HTML through custom DOM escape hatches.

### Conditional view content

Return null or false to represent an empty view.

Return an array to represent multiple children.

Use a ternary to select between nodes.

```js
const view = () => ready()
  ? h('p', null, 'Ready')
  : h('p', null, 'Waiting');
```

The renderer tracks signal reads made while it normalizes the function view.

An explicit effect is not required for this ordinary reactive rendering pattern.

### Lists and keys

Give repeated children stable keys when records can move or be removed.

Use a durable record identifier rather than an array index for reorderable lists.

Keep child structure stable when possible.

Test list insertions, removals, and reorder operations against the published runtime version.

Keys are reconciliation hints, not security identifiers.

Do not reuse one key for two siblings in the same list.

## DOM rendering

`render(view, target)` mounts a view into an existing DOM target.

`mount` is an alias for `render`.

`createRoot(target)` creates a reusable root owner.

A target is required for rendering.

A missing target causes an error.

The renderer creates DOM nodes from the normalized view tree.

It patches attributes and children after reactive updates.

The renderer returns an application object with `element()` and `destroy()`.

`element()` returns the current root DOM node.

`destroy()` stops the renderer effect and disposes registered components.

`destroy()` also removes the rendered root node.

```js
import {createRoot, h, signal} from 'teptop.js';

const target = document.querySelector('#app');
const title = signal('Teptop');
const root = createRoot(target);

root.render(() => h('h1', null, title()));
```

Call `root.unmount()` to destroy the current application under the root.

Calling `root.render()` again destroys the previous application first.

Use one root per independently managed region.

Do not mount two roots into the same target unless you deliberately manage their nodes.

Do not call browser rendering from a server-only module.

### Hydration

`hydrate(view, target)` creates a root and renders the supplied view.

The target must exist.

The current implementation is a small helper, not a complete streaming hydration system.

Verify server markup compatibility before relying on hydration for production content.

Hydration behavior should be covered by an integration test for your exact markup.

### Render ownership

A rendered root owns its renderer effect.

The root collects component disposers encountered during normalization.

Destroying the render disposes those component instances.

Independent effects created outside the rendered component still need their own disposer.

A render root does not automatically own arbitrary subscriptions created elsewhere.

Keep ownership explicit in the module or application that creates each resource.

## Components and hooks

A component can be a plain function used as an `h()` tag.

`createComponent(view)` creates a persistent component instance with hook storage.

Hooks must run while the component view is executing.

Calling a hook outside a component instance throws an error.

Hook order must remain stable between renders.

Do not put hooks inside a conditional branch.

Do not vary the number of hook calls between renders.

```js
import {createComponent, h, useState} from 'teptop.js';

const Counter = createComponent(() => {
  const [count, setCount] = useState(0);
  return h('button', {
    onclick: () => setCount(value => value + 1),
  }, `Count: ${count()}`);
});
```

`useState(initialValue)` creates persistent hook state on the first component call.

A function initial value is called lazily.

The returned tuple contains a signal and a setter.

`useReducer(reducer, initialValue)` returns a signal and a dispatch function.

`useRef(initialValue)` returns a stable `{current}` object.

`useMemo(factory, dependencies)` caches a value until dependencies differ by `Object.is`.

`useCallback(callback, dependencies)` caches the callback through `useMemo`.

`useEffect(work, dependencies)` installs an effect when dependencies change.

The component disposer stops effects created through `useEffect`.

Call `Component.dispose()` when the component is used outside a render owner.

### Component props

A component receives an object of props.

Children passed through `h(Component, props, ...children)` are provided on `props.children`.

The TypeScript `Component` type includes optional children.

Use explicit prop names rather than reading global state implicitly.

Pass event handlers through props when the parent owns the interaction.

Keep component functions focused on constructing a view.

### Hook dependencies

Pass a dependency array to `useMemo` when the cached calculation depends on values.

Dependency comparison uses `Object.is` for each item.

Create a new dependency list when its logical inputs change.

An empty dependency list is treated as stable after the first component call.

`useEffect` compares dependency arrays with the same shallow `Object.is` strategy.

Do not mutate a dependency object and expect identity comparison to detect the mutation.

### Component cleanup

Effects registered through hooks are stopped on component disposal.

Cleanup returned by `useEffect` runs before the effect reruns.

Cleanup returned by `useEffect` also runs when the component is disposed.

Use a render root as the normal owner for rendered components.

Use an explicit component disposer for manually invoked components.

## Lifecycle and context

`createScope()` groups disposer callbacks.

`scope.add(disposer)` registers a function for teardown.

`scope.effect(work)` creates and owns an effect.

`scope.close()` disposes registered functions in reverse registration order.

Closing a scope more than once has no further effect.

Adding a disposer after closure runs it immediately.

```js
import {createScope} from 'teptop.js';

const scope = createScope();
scope.effect(() => console.log('owned effect'));
scope.close();
```

The `parent` field is stored on the scope but parent-child closure is not automatic.

If a parent scope should own a child, register `child.close` with `parent.add()`.

`createContext(defaultValue)` creates a synchronous scoped context stack.

`context.read()` returns the current top value.

`context.provide(value, work)` pushes a value while `work` runs.

The previous value is restored in a `finally` block.

Context provision is synchronous.

Do not expect context to propagate across `await` boundaries.

### Resource ownership checklist

Every long-lived effect should have an owner.

Every event listener should have an unsubscribe path.

Every timer should be cancelled when obsolete.

Every DOM root should be unmounted when removed.

Every plugin cleanup should run when its application is destroyed.

Every storage subscription should be stopped when no longer needed.

A cleanup callback should tolerate repeated application shutdown paths.

## Stores

`createStore(initialState, actions)` creates a minimal signal-backed store.

Its `state` property is a signal containing the full state object.

`dispatch(name, payload)` calls the named action.

Actions receive the current state and the payload.

An action must return the next state object or value.

`patch(updates)` shallow-merges updates into the current state.

`reset()` restores a structured clone of the original state.

```js
import {createStore} from 'teptop.js';

const store = createStore({count: 0}, {
  increment: state => ({count: state.count + 1}),
});

store.dispatch('increment');
console.log(store.state().count);
```

Unknown action names throw an error.

The store clones the initial state with `structuredClone`.

Keep state cloneable when using store helpers.

Store actions should be deterministic where possible.

Do not mutate the provided current state and return the same reference.

### Advanced store

`createAdvancedStore(initialState, options)` adds history and extension points.

`options.actions` supplies named action functions.

`options.middleware` supplies middleware callbacks.

`options.onCreate` runs after the store is constructed.

`dispatch(type, payload)` records the prior state and clears the redo future.

`undo()` restores the latest history entry and returns a boolean.

`redo()` restores the latest future entry and returns a boolean.

`patch(updates)` dispatches the reserved `__patch__` action by default.

`reset()` restores initial state and clears history and future.

`select(selector)` applies a selector to the current state.

`snapshot()` returns a structured clone of state.

`hydrate(snapshot)` stores a structured clone of the supplied snapshot.

```js
import {createAdvancedStore} from 'teptop.js/store';

const store = createAdvancedStore({count: 0}, {
  actions: {increment: state => ({count: state.count + 1})},
});
store.dispatch('increment');
store.undo();
```

Middleware receives an object containing event, next, previous, and store.

Middleware runs after a dispatch changes the state.

Undo and redo do not call named actions.

Keep middleware fast because it runs in the dispatch path.

### Persist a store

`persistStore(store, storage, key)` loads a saved JSON snapshot if present.

It returns an unsubscribe function from the state subscription.

```js
import {createAdvancedStore, persistStore} from 'teptop.js/store';

const store = createAdvancedStore({theme: 'light'});
const stopPersistence = persistStore(store, localStorage, 'app-state');
```

Use browser storage only in browser code.

Provide a compatible storage object in tests.

Treat stored data as untrusted input.

Validate persisted state before trusting it in a security-sensitive flow.

Stop the persistence subscription when its owning feature is disposed.

## Async resources

`resource(loader)` models an asynchronous loading state.

The returned object contains `state`, `load`, and `reset`.

The state has `status`, `data`, and `error` fields.

The initial status is `idle`.

Calling `load(...args)` changes status to `loading`.

A successful current request changes status to `ready`.

A failed current request changes status to `error` and rethrows the error.

Newer request IDs prevent older completions from replacing newer state.

The promise for an older request still resolves or rejects to its caller.

```js
const profile = resource(async id => fetchProfile(id));
await profile.load('user-7');
console.log(profile.state().data);
```

The loading state retains the previous data while a refresh is in progress.

Reset returns the state to idle and clears data and error.

Reset does not cancel the underlying loader operation.

Use `AbortController` in the loader if transport cancellation is required.

Handle rejected `load()` promises at the call site.

A UI can subscribe to the state signal or read it in a rendered view.

### Resource state checklist

Show a loading state when `status === 'loading'`.

Show the result when `status === 'ready'`.

Show a recoverable message when `status === 'error'`.

Offer a retry action if the operation is safe to repeat.

Do not expose internal exception details to end users by default.

## Routing

`createRouter(routes, target)` integrates a route table with browser location.

Route callbacks receive `{path, params, navigate}`.

A route key may contain colon-prefixed path parameters.

The wildcard key `*` is used when no route matches.

The returned object exposes `path`, `navigate`, and `destroy`.

`navigate(path)` updates browser history and the reactive path signal.

The router listens to `popstate` and removes the listener on `destroy()`.

```js
import {createRouter, h} from 'teptop.js';

const router = createRouter({
  '/': () => h('h1', null, 'Home'),
  '/users/:id': ({params}) => h('h1', null, `User ${params.id}`),
  '*': () => h('h1', null, 'Not found'),
}, document.querySelector('#app'));
```

Call `router.destroy()` when the routed region is removed.

The browser router expects a browser environment.

The route matching implementation is intentionally small.

Use the standalone `matchPath()` helper to match a pattern.

`matchPath(pattern, pathname)` returns `null` when the route does not match.

A successful match contains `params` and the original `pathname`.

Colon segments capture one path segment.

A `*` segment captures the remaining path as `wildcard`.

A trailing slash is optional in the matched pathname.

Captured values are decoded with `decodeURIComponent`.

### Memory router

`createMemoryRouter(routes, initialPath)` avoids browser globals.

Its `path` property returns the current path.

Its `params` property returns params from the current match or an empty object.

`match()` returns the current route record or null.

`navigate(path)` updates the current path and notifies subscribers.

`subscribe(listener)` returns an unsubscribe function.

`back()` navigates to `/` in the current implementation.

It is useful for tests and non-browser workflows.

```js
import {createMemoryRouter} from 'teptop.js/router';

const router = createMemoryRouter({'/': 'home', '/users/:id': 'user'}, '/users/ada');
console.log(router.params.id);
```

### Router safety

Do not treat a matched route as authorization.

Perform access checks in trusted application logic.

Validate route parameters before using them in database queries.

Encode values when constructing external URLs.

Destroy browser routers to release their global event listener.

## Scheduling

The scheduler exposes `schedule`, `scheduleSync`, `cancelAll`, and `pendingCount`.

`schedule(work, priority)` queues a job for a microtask drain.

Supported priorities are `user-blocking`, `normal`, and `background`.

Unknown priority names are treated as `normal`.

The callback receives an object containing `id` and `priority`.

`schedule()` returns an object with `id` and `cancel()`.

Jobs are drained in priority order.

Jobs at the same priority preserve queue order because the queue is stable.

`scheduleSync(work)` calls the job immediately with priority `sync`.

`cancelAll(priority)` cancels queued work at one priority or all priorities.

`pendingCount()` reports non-cancelled queued jobs.

```js
import {schedule} from 'teptop.js/scheduler';

const task = schedule(({id}) => console.log('run', id), 'background');
task.cancel();
```

Cancellation does not interrupt a callback that has already started.

Do not use the scheduler as a substitute for a Web Worker for CPU-heavy work.

Keep scheduled callbacks short to avoid blocking the event loop.

## Forms

`createForm(initialValues, validators)` creates signal-backed form state.

The returned object exposes `values`, `errors`, `valid`, `touched`, and `submitted`.

`set(field, value)` replaces one field in the values object.

`touch(field)` marks a field as touched.

`reset()` restores initial values and clears touched and submitted state.

`submit(handler)` marks the form submitted before checking validity.

If invalid, `submit()` returns false and does not call the handler.

If valid, `submit()` calls the handler with current values and returns true.

A validator receives the field value and the complete values object.

A validator should return a falsy value for success.

A validator should return a truthy error message or error value for failure.

```js
import {createForm} from 'teptop.js/forms';

const form = createForm({email: ''}, {
  email: value => value.includes('@') ? undefined : 'Enter a valid email',
});

form.set('email', 'ada@example.test');
form.submit(values => send(values));
```

Errors and validity are computed from current values.

Touch state is separate from validation state.

Render errors according to the UX policy of your application.

Do not assume client-side validation is a security boundary.

Repeat validation on the server for protected operations.

### Form UX checklist

Associate each input with a visible or screen-reader label.

Set the correct input type for the field.

Explain validation errors in plain language.

Keep error messages adjacent to their fields.

Do not erase a user's values merely because a request failed.

Show a pending state for asynchronous submission work.

Disable duplicate submission when that matches the product behavior.

## Events

`createEmitter(options)` creates a small event bus.

Set `{history: true}` to retain event records.

`on(event, listener)` registers a listener.

`on('*', listener)` registers a wildcard listener.

A listener receives `(payload, record)`.

The event record contains `event`, `payload`, and `timestamp`.

`on()` returns an unsubscribe callback.

`off(event, listener)` removes a listener and returns a boolean.

`once(event, listener)` removes its wrapper after the first matching event.

`emit(event, payload)` invokes event listeners and wildcard listeners.

`emit()` returns the number of callbacks invoked.

`listenerCount(event)` returns the number of listeners for that event.

`events()` returns the registered named event names.

`clear(event)` removes listeners for one event.

`clear()` removes all named and wildcard listeners.

`history()` returns a shallow copy when history is enabled.

```js
import {createEmitter} from 'teptop.js/events';

const events = createEmitter({history: true});
const stop = events.on('saved', record => console.log(record));
events.emit('saved', {id: 1});
stop();
```

Keep event names stable and documented.

Prefer typed payload conventions in TypeScript applications.

Do not use a global event bus to obscure direct ownership.

### Event store

`createEventStore(initialState)` creates an immutable state holder with history.

`getState()` returns the current state object.

`update(updater, eventName)` updates state and emits an event.

An updater can be a partial object or a function.

`reset()` restores the initial state and emits a `reset` event.

The `events` property exposes the underlying emitter.

Use the event store when changes need an audit-style event trail.

The in-memory history is not durable storage.

Persist important audit records on a trusted server.

## HTTP

`createHttpClient(options)` creates a fetch-based HTTP client.

Use `baseURL` to set the URL base.

Use `headers` for default headers.

Use `timeout` for a default request timeout.

Use `retries` for a default network retry count.

Use `fetch` to inject a custom fetch implementation.

The client is callable as `client(path, config)`.

It also exposes `get`, `delete`, `head`, `post`, `put`, `patch`, and `request`.

`post`, `put`, and `patch` accept `(path, body, config)`.

Request config can contain `query`, `headers`, `signal`, `timeout`, `retries`, `retryDelay`, and `fetch`.

Object request bodies are JSON-encoded.

A JSON content type is applied when a body exists and the header is absent.

Responses with JSON content type are read using `response.json()`.

Other responses are read as text and parsed as JSON when possible.

Non-success responses throw `HttpError`.

`HttpError` exposes `status`, `statusText`, `data`, and `response`.

`client.use(interceptor)` registers request, response, and error interceptors.

The registration call returns a removal function.

```js
import {createHttpClient} from 'teptop.js/http';

const api = createHttpClient({baseURL: 'https://api.example.test'});
const user = await api.get('/users/1', {query: {include: 'profile'}});
```

Use an injected fetch implementation in deterministic tests.

Retries apply to fetch failures, not to every unsuccessful HTTP status.

Set retries carefully for non-idempotent operations.

A timeout aborts the internal controller unless a caller signal is supplied.

A caller-provided signal takes precedence over the internal signal.

Do not put secrets in URLs or logs.

Validate responses before using them as trusted application state.

### HTTP interceptors

A request interceptor receives `{url, config}`.

Return a replacement config or a falsy value to keep the prior config.

A response interceptor receives `(data, response)`.

Return a replacement value to transform the result.

An error interceptor receives the thrown error.

Return a replacement error or value according to the calling policy.

Register and remove interceptors within a clear feature lifetime.

Avoid logging authorization headers.

## Queries and caching

`createQueryClient(options)` creates an in-memory query cache.

`staleTime` sets the default fresh interval in milliseconds.

`query(key, loader, config)` returns a query handle.

The handle exposes `key`, `state`, `data`, `loading`, `refetch`, and `invalidate`.

`state` is a signal containing status, data, error, and update time.

`data` is a computed signal for the data field.

`loading` is true while status is loading or refreshing.

`refetch()` fetches data unless an in-flight promise is already shared.

Fresh cached data is returned without calling the loader again.

`invalidate()` marks the query stale and starts a refetch.

At client level, `fetch(key, loader, config)` fetches or returns fresh cached data.

`invalidate(key)` marks one cache entry stale.

`remove(key)` deletes one entry.

`clear()` removes all entries and notifies subscribers.

`keys()` returns current cache keys.

`subscribe(listener)` observes cache-level changes.

`dehydrate()` returns ready data in a serializable object.

`hydrate(snapshot)` loads serialized entries as ready data.

```js
import {createQueryClient} from 'teptop.js/query';

const queries = createQueryClient({staleTime: 30_000});
const users = queries.query(['users'], () => api.get('/users'));
await users.refetch();
```

Use stable, serializable query keys.

Object keys are serialized with `JSON.stringify`.

String keys are kept as strings.

The cache is in memory and is not a persistence layer.

Remove entries when their data should no longer be retained.

Treat hydrated data as untrusted unless it was protected by your server pipeline.

## Validation

`schema` contains constructors for basic composable schemas.

`schema.any()` accepts any value.

`schema.string()` accepts strings.

`schema.number()` accepts finite numbers.

`schema.boolean()` accepts booleans.

`schema.literal(value)` accepts one exact literal.

`schema.array(itemSchema)` validates array entries.

`schema.object(shape)` validates declared object properties.

`schema.union(schemas)` accepts a value matching at least one member.

Schemas support `.optional()`.

Schemas support `.nullable()`.

Schemas support `.refine(predicate, message)`.

`parse(value)` returns the value or throws `ValidationError`.

`safeParse(value)` returns `{success: true, data}` or `{success: false, error}`.

`ValidationError.issues` contains path-aware issue records.

`validate(value, definition)` is an alias-style safe parse helper.

```js
import {schema} from 'teptop.js/validation';

const userSchema = schema.object({
  name: schema.string(),
  age: schema.number().optional(),
});

const result = userSchema.safeParse({name: 'Ada'});
```

Issue records contain `path`, `message`, `value`, and `code`.

Array paths include numeric indexes.

Object paths include property names.

A refinement adds an issue when its predicate returns false.

The object schema validates declared fields and does not strip unknown keys.

Use schemas at trust boundaries such as API input and persisted data.

Validation is not a substitute for authorization.

## Applications and plugins

`createApp(options)` creates an application lifecycle object.

Options include `name`, `config`, `plugins`, and `providers`.

`app.name` defaults to `teptop-app`.

`app.config` is a shallow copy of the supplied config.

`app.use(plugin, options)` installs a function or an object with `install()`.

A plugin may return a cleanup function.

Installed plugin objects are not installed twice on one app.

`app.provide(key, value)` stores a service.

`app.inject(key, fallback)` reads a service or returns the fallback.

`app.on(event, listener)` subscribes to app events.

`app.emit(event, payload)` emits an app event.

`app.mount(target, view)` mounts a view and returns the render application.

`app.unmount()` removes the mounted view and returns whether one was mounted.

`app.destroy()` unmounts and invokes plugin cleanup in reverse order.

```js
import {createApp, createLoggerPlugin, h} from 'teptop.js/application';

const app = createApp({name: 'example', plugins: [createLoggerPlugin()]});
app.mount(document.querySelector('#app'), h('h1', null, 'Hello'));
```

`definePlugin(install, metadata)` creates a plugin object with metadata.

`createLoggerPlugin(options)` attaches a small logger to the app.

The logger supports debug, info, warn, and error methods.

Destroy the app when the application lifetime ends.

Plugin cleanup should undo only resources owned by that plugin.

Do not store secrets in public app config.

## Middleware pipelines

`compose(middleware)` creates a Koa-style async dispatcher.

Each handler receives `(context, next)`.

Calling `next()` proceeds to the next handler.

Calling `next()` more than once rejects with an error.

`createPipeline(options)` creates a mutable pipeline.

`use(handler)` appends middleware and returns a removal callback.

`before(handler)` registers a context transform before middleware execution.

`after(handler)` registers a context transform after middleware execution.

`onError(handler)` registers error handlers.

`size()` returns the middleware count.

`run(input, terminal)` executes the pipeline and returns the resulting context.

A before or after handler may return a replacement context.

An error handler may return a replacement error.

The original error is rethrown if no handler replaces it.

`createRequestPipeline(options)` adds request timing behavior.

```js
import {createPipeline} from 'teptop.js/pipeline';

const pipeline = createPipeline();
pipeline.use(async (context, next) => {
  context.started = true;
  return next();
});
const result = await pipeline.run({requestId: 'r-1'});
```

Keep middleware order explicit.

Always call or deliberately omit `next()` according to the handler contract.

Do not call `next()` twice.

Do not treat pipeline context as a secure sandbox.

## Collections

`createCollection(initialItems, options)` creates a reactive list model.

The default identity uses `item.id` or the item's current index.

Provide `getId(item, index)` when identity needs a domain-specific rule.

`items` exposes the full item list as a computed signal.

`visible` exposes filtered and sorted items.

`query` exposes the current filter string.

`selected` exposes selected identifiers.

`status` exposes loading status.

`setQuery(value)` changes the text filter.

`sortBy(compare)` applies a comparison function.

`add(item)` appends a cloned item.

`update(id, changes)` shallowly updates the matching item.

`remove(id)` removes and returns a matching item.

`select(id, selected)` selects or deselects an item.

`toggle(id)` switches its selection state.

`clearSelection()` clears all selected identifiers.

`replace(items)` replaces the list and marks it ready.

`load(loader)` loads an item array asynchronously.

`reset()` restores original items and clears query, sort, selection, and status.

```js
import {createCollection} from 'teptop.js/data';

const people = createCollection([{id: 1, name: 'Ada'}]);
people.setQuery('ada');
console.log(people.visible());
```

Filtering uses a lowercase JSON representation of each item.

Sorting returns a copied visible array.

The underlying items are cloned with `structuredClone` at boundaries.

Use stable IDs if records can be removed or reordered.

Do not use array position as an ID for mutable lists.

## Templates and compiler utilities

`compileTemplate(source, scope)` interpolates `{{ path }}` expressions.

Paths are dot-separated property names.

Missing values become an empty string.

Interpolated values are HTML-escaped.

`compileView(source)` returns a function that accepts a scope.

`parseAttributes(source)` parses simple attribute text into an object.

Boolean attributes without a value become `true`.

Quoted and unquoted values are supported by the small parser.

```js
import {compileView, parseAttributes} from 'teptop.js/compiler';

const greeting = compileView('Hello, {{ user.name }}');
console.log(greeting({user: {name: 'Ada'}}));
console.log(parseAttributes('type="email" required'));
```

This template helper is not a general JavaScript expression evaluator.

It does not execute arbitrary template expressions.

Use a dedicated parser for complex template languages.

Do not concatenate untrusted strings into executable JavaScript.

## Server serialization

Import `toHTML` from `teptop.js/server`.

The serializer handles primitives, arrays, and Teptop view objects.

It escapes `&`, `<`, `>`, double quotes, and single quotes.

It maps `className` to `class`.

It serializes boolean true as a present attribute.

It omits false and nullish attributes.

It omits event props, `key`, and `ref`.

It emits known void elements without a closing tag.

It serializes component tags by invoking the component function.

```js
import {h} from 'teptop.js';
import {toHTML} from 'teptop.js/server';

const html = toHTML(h('p', null, 'Safe < text'));
```

The serializer escapes text content.

The serializer is not a sanitizer for arbitrary HTML fragments.

Do not mark untrusted content as trusted markup.

Do not assume browser event behavior is encoded in server output.

Use a server framework for routing, headers, cookies, and streaming responses.

## Testing

Use Node's built-in test runner for server-safe logic.

Use `node:test` and `node:assert/strict` for focused tests.

Test reactive values independently of the DOM where possible.

Use `createTestRenderer(document)` when a DOM implementation is available.

`createTestRenderer()` creates a target element.

`render(view)` mounts a view and flushes pending reactive work.

`html()` returns the target's `innerHTML`.

`element(selector)` queries an element inside the target.

`fire(type, selector, init)` dispatches an event.

`cleanup()` destroys roots and removes the test target.

```js
import {createTestRenderer} from 'teptop.js/testing';

const renderer = createTestRenderer(document);
const root = renderer.render(view);
renderer.cleanup();
```

Pass a DOM implementation in Node tests; Teptop does not provide one.

Call `cleanup()` even when an assertion fails.

Use `try/finally` or the test runner's teardown hook for cleanup.

Wait for a microtask after ordinary signal writes when needed.

Avoid timing-sensitive sleeps for deterministic state updates.

Inject fake `fetch` into HTTP clients.

Use memory routers for route tests.

## Devtools

`devtools(label)` creates an inspection API.

The returned API exposes `label`, `record`, `clear`, `snapshot`, and `inspect`.

`record(type, payload)` stores a timestamped event.

`snapshot()` returns shallow copies of event records.

`inspect(value)` returns the label, value, and object keys.

The tool is also added to `globalThis.__TEPTOP_DEVTOOLS__`.

`trace(name, work, tool)` measures synchronous work with `performance.now()`.

`trace()` records duration even when the callback throws.

It returns the callback result or rethrows the callback error.

```js
import {devtools, trace} from 'teptop.js/devtools';

const tools = devtools('profile');
const result = trace('calculate', () => 6 * 7, tools);
```

Tracing does not profile asynchronous work after a promise is returned.

Do not record credentials or sensitive user data.

Clear retained events when they are no longer useful.

## TypeScript

The package publishes a root declaration file.

Import public names from `teptop.js` or documented subpaths.

Use generics on signals to preserve useful value types.

```ts
import {signal} from 'teptop.js';

const count = signal<number>(0);
count.set(value => value + 1);
```

Use explicit types for API payloads and store state.

Review the declarations shipped by the installed package version.

Some runtime exports may not yet have detailed declarations.

Do not assume a JavaScript export is fully typed merely because it exists at runtime.

Report declaration mismatches with a reproducible example.

### Type declaration coverage note

The root declaration file is a concise public surface.

Check it before relying on inferred types for a subsystem.

Use local interfaces around loosely typed helper return values if needed.

Avoid weakening the entire application to `any` to work around one missing declaration.

Keep runtime and declaration versions aligned when contributing changes.

## Security notes

Escape untrusted text at output boundaries.

Validate untrusted input before using it in domain logic.

Enforce authorization on trusted server code.

Do not put secrets in frontend bundles.

Do not trust client-side route guards as an access-control system.

Do not retry non-idempotent HTTP requests without an explicit policy.

Treat local storage as attacker-controlled input.

Do not serialize sensitive data into devtools history.

Use HTTPS for network requests containing private information.

Check URLs derived from user input before making requests.

Apply server-side rate limits to public endpoints.

Teptop provides application primitives, not a complete security model.

## Common patterns

### Counter with derived output

```js
const count = signal(0);
const doubled = computed(() => count() * 2);

function increment() {
  count.update(value => value + 1);
}
```

### Reset multiple values together

```js
batch(() => {
  search.set('');
  page.set(1);
  selectedIds.set([]);
});
```

### Watch and unsubscribe

```js
const stop = watch(routeId, (next, previous) => {
  if (next !== previous) loadRecord(next);
});
```

### Render and unmount

```js
const root = createRoot(document.querySelector('#app'));
root.render(() => h('p', null, message()));

// When the owner is removed:
root.unmount();
```

### Abort an obsolete request

```js
let controller;

async function load(url) {
  controller?.abort();
  controller = new AbortController();
  return fetch(url, {signal: controller.signal});
}
```

### Persist application state

```js
const stop = persistStore(store, localStorage, 'settings');

// Call stop when the settings feature is disposed.
```

### One-shot event listener

```js
const events = createEmitter();
events.once('ready', payload => initialize(payload));
```

### Query with a stable key

```js
const project = queries.query(['project', projectId], () => api.get(`/projects/${projectId}`));
```

### Schema at a boundary

```js
const input = userSchema.safeParse(untrustedPayload);
if (!input.success) throw input.error;
```

### Plugin cleanup

```js
const plugin = definePlugin(app => {
  const stop = window.addEventListener('online', onOnline);
  return () => window.removeEventListener('online', onOnline);
});
```

For browser APIs, implement cleanup using the API's actual returned handle.

For example, `addEventListener()` itself returns `undefined`.

### Pipeline middleware

```js
pipeline.use(async (context, next) => {
  context.startedAt = Date.now();
  return next();
});
```

### Collection selection

```js
collection.toggle(item.id);
const selectedIds = collection.selected();
```

## Troubleshooting

### An effect does not rerun

Confirm that the signal is read inside the effect callback.

Confirm that the effect has not already been disposed.

Confirm that the write changes the value according to `Object.is`.

Wait for the scheduled microtask after writing.

### A computed value looks stale immediately after a write

The source signal changes immediately.

The computed effect is scheduled for a later microtask.

Wait for that update or use `flushSync()` at an integration boundary.

### A view does not update

Confirm the view reads the signal while it is being normalized.

Confirm that the signal is not only read before calling `render()`.

Confirm the root has not been destroyed.

Confirm DOM rendering runs in a browser with a valid target.

### An object mutation is not reactive

Signal values are not deeply proxied.

Replace the value or use an immutable updater.

### A component hook throws

Call hooks only inside a `createComponent()` view.

Keep hook calls in a stable order.

Do not call hooks from an event handler.

### `document` is undefined

Do not import browser rendering into a Node-only execution path.

Use `toHTML()` for server serialization.

Provide a DOM implementation to DOM tests.

### A network response throws

Inspect `HttpError.status`, `HttpError.data`, and `HttpError.response`.

Check whether the server returned a non-success response.

Check whether response parsing matches the content type.

### A persisted store fails to load

Check the storage key and JSON value.

Handle parse errors around untrusted persisted content.

Confirm the stored snapshot matches the current state schema.

### A router keeps listening after unmount

Call the browser router's `destroy()` method.

### Middleware reports `next()` more than once

Ensure each middleware calls `next()` at most once.

Do not call `next()` both before and after an awaited branch.

### TypeScript cannot find a helper

Confirm the installed package version.

Confirm the helper exists in that version's runtime export map.

Confirm the package declaration file covers that export.

### A subpath import fails

Use only paths listed under the `exports` field.

Use the exact case-sensitive spelling.

Confirm the package manager installed the package.

## API index

### Root runtime exports

`signal` creates a reactive signal.

`computed` creates a derived signal.

`effect` creates a tracked side effect and disposer.

`watch` observes a signal and reports previous and next values.

`batch` groups reactive writes.

`flushSync` drains pending reactive work synchronously.

`startTransition` batches a callback as a transition boundary.

`deferred` creates a delayed signal value.

`createScope` groups cleanup functions and effects.

`createContext` creates synchronous scoped values.

`resource` tracks asynchronous loader state.

`h` creates a plain view node.

`createElement` aliases `h`.

`Fragment` is the fragment tag.

`createComponent` creates a persistent hook component.

`useState` creates component state.

`useReducer` creates component reducer state.

`useRef` creates a persistent reference object.

`useMemo` memoizes a component calculation.

`useCallback` memoizes a component callback.

`useEffect` installs a component-owned effect.

`memo` skips view recomputation when props compare equal.

`lazy` loads a component module on demand.

`errorBoundary` returns a fallback when view construction throws.

`ref` creates a mutable reference object.

`render` mounts and tracks a view.

`mount` aliases `render`.

`createRoot` owns a render region.

`hydrate` mounts a view into an existing target.

`createRouter` creates a browser history router.

`version` reports the runtime version string.

### State and data exports

`createStore` creates a minimal action store.

`createAdvancedStore` creates a store with history and middleware.

`persistStore` synchronizes store state with a storage object.

`createCollection` creates a reactive list model.

`createEventStore` creates event-backed immutable state.

### Application service exports

`createEmitter` creates an event emitter.

`createHttpClient` creates a fetch client.

`HttpError` represents an unsuccessful HTTP response.

`createQueryClient` creates an in-memory cache.

`schema` provides schema constructors.

`validate` performs safe parsing.

`ValidationError` represents schema failures.

`createForm` creates signal-backed form state.

`createApp` creates an application owner.

`definePlugin` creates a plugin with metadata.

`createLoggerPlugin` attaches a logger to an app.

`compose` composes async middleware.

`createPipeline` creates a configurable middleware pipeline.

`createRequestPipeline` creates a request-oriented pipeline.

### Routing and compile exports

`matchPath` matches a route pattern.

`createMemoryRouter` creates a router without browser globals.

`link` creates navigation props for a memory router.

`compileTemplate` interpolates escaped dotted paths.

`compileView` creates a reusable template function.

`parseAttributes` parses simple attribute strings.

### Scheduler and diagnostics exports

`schedule` queues prioritized work.

`scheduleSync` runs work immediately.

`cancelAll` marks queued tasks cancelled.

`pendingCount` reports queued uncancelled tasks.

`devtools` creates an event inspection tool.

`trace` records synchronous callback duration.

`createTestRenderer` creates a DOM-backed rendering test helper.

`toHTML` serializes Teptop nodes to HTML.

### Subpath reference

Import renderer and reactive functions from `teptop.js`.

Import `toHTML` from `teptop.js/server`.

Import scheduler functions from `teptop.js/scheduler`.

Import stores from `teptop.js/store`.

Import routing utilities from `teptop.js/router`.

Import compile helpers from `teptop.js/compiler`.

Import forms from `teptop.js/forms`.

Import devtools from `teptop.js/devtools`.

Import `createTestRenderer` from `teptop.js/testing`.

Import event utilities from `teptop.js/events`.

Import HTTP utilities from `teptop.js/http`.

Import query caching from `teptop.js/query`.

Import schemas from `teptop.js/validation`.

Import app lifecycle helpers from `teptop.js/application`.

Import middleware helpers from `teptop.js/pipeline`.

Import collections from `teptop.js/data`.

## Notes and important guidance

> **Note:** Reactive writes are synchronous, but dependent effects are normally coalesced into a microtask.

> **Note:** Effects execute once immediately when created, before later scheduled reruns.

> **Note:** `computed()` currently owns an internal effect and does not expose a stop function.

> **Note:** The browser router requires browser history and event APIs.

> **Note:** The memory router's `back()` currently navigates to `/`; it is not a browser history stack.

> **Note:** The template compiler interpolates dotted paths only; it does not evaluate JavaScript expressions.

> **Note:** Store and collection cloning uses `structuredClone`.

> **Note:** The DOM renderer is intentionally small; test the exact DOM features your application depends on.

> **Note:** Server serialization is synchronous and does not provide streaming or request handling.

> **Note:** Query caching is in memory and requires an application policy for cache cleanup.

> **Note:** `startTransition()` currently batches work; do not assume time slicing.

> **Note:** A `Signal` does not deeply observe nested mutation.

> **Important:** Stop effects and subscriptions when their owner is destroyed.

> **Important:** Always destroy browser routers to remove their global `popstate` listener.

> **Important:** Always call the render application's `destroy()` or the root's `unmount()` when removing a rendered region.

> **Important:** Validate untrusted data on the server even if it was validated in the browser.

> **Important:** Client-side route matching is not authorization.

> **Important:** Do not retry non-idempotent HTTP operations without a deliberate retry policy.

> **Important:** Do not expose secret values in event histories, devtools records, or browser bundles.

> **Important:** Escape or validate values at every output boundary.

> **Important:** Use immutable updates when changing objects held in signals.

> **Important:** Verify package declarations for the exact Teptop version you install.

> **Important:** Read the export map before importing subpaths.

> **Important:** Prefer deterministic tests with injected network and storage dependencies.

## Contribution and compatibility

Keep public API documentation aligned with the package export map.

Keep examples aligned with the implementation and its declaration files.

Add tests when changing externally observable behavior.

Document breaking changes before publishing a new major version.

Check minimum Node.js support before using a newer runtime API.

Do not introduce browser globals into server-only modules.

Do not depend on undocumented private source paths.

Do not assume companion package versions are identical to the core version.

Check the npm registry before pinning companion package versions.

Keep the root `version` export synchronized with the release process.

## Quick reference checklist

Install `teptop.js` from npm.

Import only public package exports.

Create state with `signal()`.

Create derivations with `computed()`.

Create side effects with `effect()` or `watch()`.

Save and invoke every disposer.

Batch related writes with `batch()`.

Create views with `h()`.

Mount views only when a DOM is available.

Use `toHTML()` for server serialization.

Unmount render roots when their owner is removed.

Use stable keys for repeated child lists.

Use immutable updates for object state.

Use `resource()` for straightforward asynchronous state.

Use a query client when shared cache behavior is needed.

Validate external values with schemas.

Handle HTTP and validation errors deliberately.

Keep route access checks on the server.

Use a memory router in isolated tests.

Use an injected fetch implementation in HTTP tests.

Use a storage adapter in persistence tests.

Clean up plugins and subscriptions.

Treat local storage as untrusted.

Avoid putting secrets in client-visible state.

Check the installed API version before copying examples from another release.

Run the package test suite after updating the runtime.

Review type declaration coverage when adding TypeScript usage.

Confirm every package subpath exists in `package.json` exports.

## Final note

Teptop is designed to keep state transitions and ownership visible.

Start with signals and plain view objects.

Add stores and services when the application needs their behavior.

Keep each effect, subscription, router, and render root attached to a clear lifetime.

Read source and tests when behavior needs more precision than this public guide provides.
