const isFunction = value => typeof value === 'function';
const isObject = value => value !== null && typeof value === 'object';

let activeEffect = null;
let activeDependencies = null;
let pending = new Set();
let batching = 0;
let scheduled = false;
let transitionDepth = 0;
let taskId = 0;
const tasks = new Map();
let currentComponent = null;
let activeComponents = null;

const sameDependencies = (previous, next) => previous && next && previous.length === next.length && previous.every((value, index) => Object.is(value, next[index]));

function requireComponentHook(name) {
  if (!currentComponent) throw new Error(`Teptop ${name} must be called inside createComponent().`);
  return currentComponent;
}

function flush() {
  if (scheduled || batching || pending.size === 0) return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    const jobs = [...pending];
    pending.clear();
    jobs.forEach(job => job());
    if (pending.size) flush();
  });
}

function enqueue(job) {
  pending.add(job);
  flush();
}

export function startTransition(work) {
  transitionDepth++;
  try { return batch(work); } finally { transitionDepth--; }
}

export function scheduleTask(work, priority = 'normal') {
  const id = ++taskId;
  const rank = {high: 0, normal: 1, low: 2}[priority] ?? 1;
  tasks.set(id, {work, rank});
  queueMicrotask(() => {
    const task = tasks.get(id);
    if (!task) return;
    tasks.delete(id);
    task.work();
  });
  return id;
}

export function cancelTask(id) {
  return tasks.delete(id);
}

export function flushSync(work) {
  const result = work?.();
  while (pending.size) {
    const jobs = [...pending];
    pending.clear();
    jobs.forEach(job => job());
  }
  return result;
}

export function createScope(parent = null) {
  const disposers = new Set();
  let closed = false;
  const scope = {
    parent,
    add(disposer) {
      if (closed) { disposer(); return disposer; }
      if (isFunction(disposer)) disposers.add(disposer);
      return disposer;
    },
    effect(work) {
      const stop = effect(work);
      scope.add(stop);
      return stop;
    },
    close() {
      if (closed) return;
      closed = true;
      [...disposers].reverse().forEach(disposer => disposer());
      disposers.clear();
    },
  };
  return scope;
}

export function createContext(defaultValue) {
  const stack = [defaultValue];
  return {
    read: () => stack[stack.length - 1],
    provide(value, work) {
      stack.push(value);
      try { return work(); } finally { stack.pop(); }
    },
  };
}

export function batch(work) {
  batching++;
  try { return work(); } finally {
    batching--;
    flush();
  }
}

export function signal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();
  const read = () => {
    if (activeEffect) {
      subscribers.add(activeEffect);
      activeDependencies.add(subscribers);
    }
    return value;
  };
  read.set = next => {
    const resolved = isFunction(next) ? next(value) : next;
    if (Object.is(resolved, value)) return value;
    value = resolved;
    subscribers.forEach(enqueue);
    return value;
  };
  read.update = updater => read.set(updater);
  read.peek = () => value;
  read.subscribe = subscriber => {
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  };
  return read;
}

export function computed(derive) {
  const output = signal();
  effect(() => output.set(derive()));
  return output;
}

export function deferred(source, delay = 0) {
  const output = signal(source());
  let timer;
  effect(() => {
    const next = source();
    clearTimeout(timer);
    timer = setTimeout(() => output.set(next), delay);
    return () => clearTimeout(timer);
  });
  return output;
}

export function effect(work) {
  const dependencies = new Set();
  let cleanup;
  let stopped = false;
  const run = () => {
    if (stopped) return;
    dependencies.forEach(subscribers => subscribers.delete(run));
    dependencies.clear();
    if (isFunction(cleanup)) cleanup();
    const previousEffect = activeEffect;
    const previousDependencies = activeDependencies;
    activeEffect = run;
    activeDependencies = dependencies;
    try {
      const nextCleanup = work();
      cleanup = isFunction(nextCleanup) ? nextCleanup : undefined;
    } finally {
      activeEffect = previousEffect;
      activeDependencies = previousDependencies;
    }
  };
  run();
  return () => {
    stopped = true;
    dependencies.forEach(subscribers => subscribers.delete(run));
    dependencies.clear();
    if (isFunction(cleanup)) cleanup();
  };
}

export function watch(source, callback, options = {}) {
  let previous;
  let initialized = false;
  return effect(() => {
    const next = isFunction(source) ? source() : source();
    if (initialized || options.immediate) callback(next, previous);
    previous = next;
    initialized = true;
  });
}

export function createStore(initialState, actions = {}) {
  const initial = structuredClone(initialState);
  const state = signal(structuredClone(initial));
  return {
    state,
    dispatch(name, payload) {
      const action = actions[name];
      if (!isFunction(action)) throw new Error(`Unknown Teptop action: ${name}`);
      state.set(current => action(current, payload));
    },
    patch(updates) { state.update(current => ({...current, ...updates})); },
    reset() { state.set(structuredClone(initial)); },
  };
}

export function resource(loader) {
  const state = signal({status: 'idle', data: undefined, error: undefined});
  let requestId = 0;
  const load = async (...args) => {
    const id = ++requestId;
    state.set({status: 'loading', data: state.peek().data, error: undefined});
    try {
      const data = await loader(...args);
      if (id === requestId) state.set({status: 'ready', data, error: undefined});
      return data;
    } catch (error) {
      if (id === requestId) state.set({status: 'error', data: undefined, error});
      throw error;
    }
  };
  return {state, load, reset: () => state.set({status: 'idle', data: undefined, error: undefined})};
}

export function lazy(loader) {
  let loaded;
  let pendingLoad;
  return props => {
    if (!pendingLoad) pendingLoad = Promise.resolve(loader()).then(module => {
      loaded = module.default || module;
      return loaded;
    });
    return loaded ? loaded(props) : h('teptop-loading', null, 'Loading...');
  };
}

export function memo(view, compare = (previous, next) => {
  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);
  return previousKeys.length === nextKeys.length && previousKeys.every(key => Object.is(previous[key], next[key]));
}) {
  let previousProps;
  let previousView;
  return props => {
    if (previousProps && compare(previousProps, props)) return previousView;
    previousProps = props;
    previousView = view(props);
    return previousView;
  };
}

export function errorBoundary(view, fallback) {
  return props => {
    try { return view(props); }
    catch (error) { return isFunction(fallback) ? fallback(error, props) : fallback; }
  };
}

export function h(tag, props, ...children) {
  return {tag, props: props || {}, children: children.flat(Infinity), key: props?.key};
}

export const Fragment = 'teptop-fragment';
export const createElement = h;

export function createComponent(view) {
  if (!isFunction(view)) throw new TypeError('Teptop components must be functions.');
  const instance = {hooks: [], cursor: 0, disposers: new Set()};
  const component = props => {
    const previous = currentComponent;
    currentComponent = instance;
    instance.cursor = 0;
    try { return view(props || {}); }
    finally { currentComponent = previous; }
  };
  component.dispose = () => {
    instance.disposers.forEach(dispose => dispose());
    instance.disposers.clear();
  };
  return component;
}

export function useState(initialValue) {
  const instance = requireComponentHook('useState');
  const index = instance.cursor++;
  if (!instance.hooks[index]) {
    const value = isFunction(initialValue) ? initialValue() : initialValue;
    const state = signal(value);
    instance.hooks[index] = [state, next => state.set(next)];
  }
  return instance.hooks[index];
}

export function useReducer(reducer, initialValue, initializer) {
  const [state, setState] = useState(() => initializer ? initializer(initialValue) : initialValue);
  return [state, action => setState(current => reducer(current, action))];
}

export function useRef(initialValue = null) {
  const instance = requireComponentHook('useRef');
  const index = instance.cursor++;
  if (!instance.hooks[index]) instance.hooks[index] = {current: initialValue};
  return instance.hooks[index];
}

export function useMemo(factory, dependencies = []) {
  const instance = requireComponentHook('useMemo');
  const index = instance.cursor++;
  const previous = instance.hooks[index];
  if (!previous || !sameDependencies(previous.dependencies, dependencies)) {
    instance.hooks[index] = {value: factory(), dependencies: [...dependencies]};
  }
  return instance.hooks[index].value;
}

export function useCallback(callback, dependencies = []) {
  return useMemo(() => callback, dependencies);
}

export function useEffect(work, dependencies = []) {
  const instance = requireComponentHook('useEffect');
  const index = instance.cursor++;
  const previous = instance.hooks[index];
  if (!previous || !sameDependencies(previous.dependencies, dependencies)) {
    previous?.stop();
    const stop = effect(() => work());
    instance.hooks[index] = {dependencies: [...dependencies], stop};
    instance.disposers.add(stop);
  }
}

export function ref(initialValue = null) {
  return {current: initialValue};
}

const resolve = value => isFunction(value) && !value.__teptopHandler ? value() : value;

function normalize(value) {
  if (isFunction(value) && value.dispose) activeComponents?.add(value);
  value = resolve(value);
  if (value == null || value === false || value === true) return {tag: null, props: {}, children: []};
  if (Array.isArray(value)) return h('teptop-fragment', null, ...value);
  if (!isObject(value)) return String(value);
  if (isFunction(value.tag)) {
    activeComponents?.add(value.tag);
    return normalize(value.tag({...value.props, children: value.children}));
  }
  return {...value, children: value.children.map(normalize)};
}

function setProperty(element, name, value, previous) {
  if (name === 'key' || name === 'ref') return;
  const attribute = name === 'className' ? 'class' : name;
  if (name === 'style' && isObject(value)) {
    Object.assign(element.style, value);
    return;
  }
  if (name.startsWith('on')) {
    const event = name.slice(2).toLowerCase();
    if (previous) element.removeEventListener(event, previous);
    if (isFunction(value)) element.addEventListener(event, value);
    return;
  }
  if (value === false || value == null) element.removeAttribute(attribute);
  else if (value === true) element.setAttribute(attribute, '');
  else if (value !== previous) element.setAttribute(attribute, value);
}

function createNode(vnode) {
  if (typeof vnode !== 'object') return document.createTextNode(vnode);
  if (!vnode.tag) return document.createComment('teptop-empty');
  const element = document.createElement(vnode.tag === 'teptop-fragment' ? 'span' : vnode.tag);
  Object.entries(vnode.props).forEach(([name, property]) => {
    if (name === 'ref' && property) property.current = element;
    setProperty(element, name, name.startsWith('on') ? property : resolve(property));
  });
  vnode.children.forEach(child => element.appendChild(createNode(child)));
  return element;
}

function patch(parent, previous, next, node) {
  if (!previous) {
    const created = createNode(next);
    parent.appendChild(created);
    return created;
  }
  if (!next) {
    node.remove();
    return null;
  }
  if (typeof previous !== typeof next || (isObject(next) && previous.tag !== next.tag)) {
    const created = createNode(next);
    parent.replaceChild(created, node);
    return created;
  }
  if (!isObject(next)) {
    if (previous !== next) node.nodeValue = next;
    return node;
  }
  const props = new Set([...Object.keys(previous.props), ...Object.keys(next.props)]);
  props.forEach(name => {
    const oldValue = name.startsWith('on') ? previous.props[name] : resolve(previous.props[name]);
    const newValue = name.startsWith('on') ? next.props[name] : resolve(next.props[name]);
    if (name === 'ref') {
      if (previous.props[name]?.current === node) previous.props[name].current = null;
      if (next.props[name]) next.props[name].current = node;
    } else setProperty(node, name, newValue, oldValue);
  });
  const oldChildren = previous.children;
  const newChildren = next.children;
  const pool = new Map(oldChildren.map((child, index) => [child.key ?? index, {child, node: node.childNodes[index]}]));
  newChildren.forEach((child, index) => {
    const entry = pool.get(child.key ?? index);
    const updated = patch(node, entry?.child || oldChildren[index], child, entry?.node || node.childNodes[index]);
    if (updated && updated !== node.childNodes[index]) node.insertBefore(updated, node.childNodes[index] || null);
    pool.delete(child.key ?? index);
  });
  pool.forEach(entry => entry.node?.remove());
  return node;
}

export function render(view, target) {
  if (!target) throw new Error('Teptop render target was not found.');
  let current = null;
  let node = null;
  const components = new Set();
  const stop = effect(() => {
    const previousComponents = activeComponents;
    activeComponents = components;
    let next;
    try { next = normalize(view); }
    finally { activeComponents = previousComponents; }
    node = patch(target, current, next, node);
    current = next;
  });
  return {element: () => node, destroy: () => { stop(); components.forEach(component => component.dispose()); components.clear(); node?.remove(); }};
}

export const mount = render;

export function createRoot(target) {
  let application;
  return {
    render(view) {
      application?.destroy();
      application = render(view, target);
      return application;
    },
    unmount() {
      application?.destroy();
      application = undefined;
    },
  };
}

export function hydrate(view, target) {
  if (!target) throw new Error('Teptop hydration target was not found.');
  const application = createRoot(target);
  if (target.firstChild) {
    const marker = target.firstChild;
    application.render(view);
    if (target.firstChild?.nodeType === 8) target.replaceChild(marker, target.firstChild);
  } else application.render(view);
  return application;
}

export function createRouter(routes, target) {
  const path = signal(globalThis.location?.pathname || '/');
  const navigate = nextPath => {
    if (globalThis.history) globalThis.history.pushState({}, '', nextPath);
    path.set(nextPath);
  };
  const matchRoute = currentPath => Object.entries(routes).find(([pattern]) => {
    if (pattern === '*') return false;
    const names = [];
    const expression = new RegExp(`^${pattern.replace(/:[^/]+/g, name => { names.push(name.slice(1)); return '([^/]+)'; })}$`);
    const match = currentPath.match(expression);
    return match && {match, names};
  });
  const view = () => {
    const result = matchRoute(path());
    const route = result ? result[0] : routes[path()] ? path() : '*';
    const params = result ? Object.fromEntries(result.names.map((name, index) => [name, result.match[index + 1]])) : {};
    return routes[route]({path: path(), params, navigate});
  };
  const onPopState = () => path.set(globalThis.location.pathname);
  globalThis.addEventListener?.('popstate', onPopState);
  const app = render(view, target);
  return {path, navigate, destroy: () => { globalThis.removeEventListener?.('popstate', onPopState); app.destroy(); }};
}

export const version = '1.3.0';

export {schedule, scheduleSync, cancelAll, pendingCount} from './scheduler.js';
export {createAdvancedStore, persistStore} from './store.js';
export {matchPath, createMemoryRouter, link} from './router.js';
export {compileTemplate, compileView, parseAttributes} from './compiler.js';
export {createForm} from './forms.js';
export {devtools, trace} from './devtools.js';
export {createEmitter, createEventStore} from './events.js';
export {createHttpClient, HttpError} from './http.js';
export {createQueryClient} from './query.js';
export {schema, validate, ValidationError} from './validation.js';
export {createApp, definePlugin, createLoggerPlugin} from './application/plugins.js';
export {compose, createPipeline, createRequestPipeline} from './pipeline/middleware.js';
export {createCollection} from './data/collection.js';
