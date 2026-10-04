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
    instance.hooks.length = 0;
    instance.cursor = 0;
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
    if (previous) instance.disposers.delete(previous.stop);
    const stop = effect(() => work());
    instance.hooks[index] = {dependencies: [...dependencies], stop};
    instance.disposers.add(stop);
  }
}

export function ref(initialValue = null) {
  return {current: initialValue};
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const FRAGMENT_TAG = 'teptop-fragment';
const EMPTY = Symbol('teptop.empty');
const booleanProperties = new Set(['checked', 'disabled', 'multiple', 'muted', 'readOnly', 'required', 'selected', 'autofocus', 'hidden', 'open']);
const unitlessStyles = new Set(['animationIterationCount', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'columnCount', 'flex', 'flexGrow', 'flexShrink', 'fontWeight', 'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineHeight', 'opacity', 'order', 'scale', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'WebkitLineClamp', 'zIndex', 'zoom']);
const propertyNames = {className: 'class', htmlFor: 'for', tabIndex: 'tabindex', readOnly: 'readonly', autoFocus: 'autofocus'};

const resolve = value => isFunction(value) && !value.__teptopHandler ? value() : value;

export class HydrationMismatchError extends Error {
  constructor(path, expected, actual) {
    super(`Teptop hydration mismatch at ${path}: expected ${expected}, received ${actual}.`);
    this.name = 'HydrationMismatchError';
    this.path = path;
    this.expected = expected;
    this.actual = actual;
  }
}

function normalize(value, components = activeComponents) {
  if (isFunction(value)) {
    if (value.dispose) components?.add(value);
    value = value();
  }
  if (value == null || value === false || value === true) return EMPTY;
  if (Array.isArray(value)) value = h(FRAGMENT_TAG, null, ...value);
  if (!isObject(value)) return String(value);
  if (isFunction(value.tag)) {
    if (value.tag.dispose) components?.add(value.tag);
    return normalize(value.tag({...value.props, children: value.children}), components);
  }
  return {...value, children: (value.children || []).map(child => normalize(child, components))};
}

function isFragment(vnode) {
  return vnode && typeof vnode === 'object' && (vnode.tag === Fragment || vnode.tag === FRAGMENT_TAG);
}

function instanceKind(vnode) {
  if (vnode === EMPTY) return 'empty';
  if (typeof vnode === 'string') return 'text';
  return isFragment(vnode) ? 'fragment' : 'element';
}

function firstNode(instance) {
  if (!instance || instance.kind === 'empty') return null;
  return instance.kind === 'fragment' ? instance.start : instance.node;
}

function lastNode(instance) {
  if (!instance || instance.kind === 'empty') return null;
  return instance.kind === 'fragment' ? instance.end : instance.node;
}

function rangeNodes(instance) {
  const first = firstNode(instance);
  const last = lastNode(instance);
  if (!first || !last) return [];
  const nodes = [];
  let current = first;
  while (current) {
    nodes.push(current);
    if (current === last) break;
    current = current.nextSibling;
  }
  return nodes;
}

function insertRange(parent, instance, before) {
  for (const node of rangeNodes(instance)) parent.insertBefore(node, before || null);
}

function eventType(name) {
  if (name.startsWith('on:')) return name.slice(3).toLowerCase();
  return name.startsWith('on') ? name.slice(2).toLowerCase() : null;
}

function setStyle(element, next, previous = {}) {
  for (const name of Object.keys(previous || {})) {
    if (!(name in (next || {}))) {
      if (name.startsWith('--')) element.style.removeProperty(name);
      else element.style[name] = '';
    }
  }
  for (const [name, value] of Object.entries(next || {})) {
    if (value == null || value === false) {
      if (name.startsWith('--')) element.style.removeProperty(name);
      else element.style[name] = '';
    } else if (name.startsWith('--')) element.style.setProperty(name, String(value));
    else element.style[name] = typeof value === 'number' && value !== 0 && !unitlessStyles.has(name) && !name.startsWith('--') ? `${value}px` : String(value);
  }
}

function setProperty(instance, name, value, previous) {
  const element = instance.node;
  if (name === 'key') return;
  if (name === 'ref') {
    if (previous && previous !== value && previous.current === element) previous.current = null;
    if (value) value.current = element;
    return;
  }
  const event = eventType(name);
  if (event) {
    const oldHandler = instance.events.get(event);
    if (oldHandler) element.removeEventListener(event, oldHandler);
    instance.events.delete(event);
    if (isFunction(value)) {
      element.addEventListener(event, value);
      instance.events.set(event, value);
    }
    return;
  }
  if (name === 'style') {
    setStyle(element, value, previous);
    return;
  }
  const attribute = propertyNames[name] || name;
  if (name === 'value' || name === 'checked' || name === 'selected') {
    if (name === 'value') element.value = value == null ? '' : String(value);
    else element[name] = Boolean(value);
    if (value == null || value === false) element.removeAttribute(attribute);
    else element.setAttribute(attribute, value === true ? '' : String(value));
    return;
  }
  if (booleanProperties.has(name)) {
    element[name] = Boolean(value);
    if (value) element.setAttribute(attribute, '');
    else element.removeAttribute(attribute);
    return;
  }
  if (value == null || value === false) {
    element.removeAttribute(attribute);
  } else if (value === true) {
    element.setAttribute(attribute, '');
  } else if (!Object.is(value, previous)) {
    if (name === 'xlink:href') element.setAttributeNS('http://www.w3.org/1999/xlink', name, String(value));
    else element.setAttribute(attribute, String(value));
  }
}

function applyProps(instance, previous = {}, next = {}) {
  const names = new Set([...Object.keys(previous), ...Object.keys(next)]);
  for (const name of names) {
    const oldValue = eventType(name) ? previous[name] : resolve(previous[name]);
    const newValue = eventType(name) ? next[name] : resolve(next[name]);
    if (!Object.is(oldValue, newValue) || name === 'ref' || name === 'style') setProperty(instance, name, newValue, oldValue);
  }
  instance.props = next;
}

function makeElement(document, parent, tag) {
  const inSvg = parent.namespaceURI === SVG_NAMESPACE && parent.localName !== 'foreignObject';
  return inSvg || tag === 'svg' ? document.createElementNS(SVG_NAMESPACE, tag) : document.createElement(tag);
}

function mountInstance(parent, vnode, before = null) {
  const kind = instanceKind(vnode);
  if (kind === 'empty') return {kind, vnode};
  const document = parent.ownerDocument || globalThis.document;
  if (kind === 'text') {
    const node = document.createTextNode(vnode);
    parent.insertBefore(node, before);
    return {kind, node, vnode};
  }
  if (kind === 'fragment') {
    const start = document.createComment('teptop:fragment:start');
    const end = document.createComment('teptop:fragment:end');
    parent.insertBefore(start, before);
    parent.insertBefore(end, before);
    const instance = {kind, start, end, children: [], vnode};
    instance.children = reconcileChildren(parent, [], vnode.children, end);
    return instance;
  }
  const node = makeElement(document, parent, vnode.tag);
  parent.insertBefore(node, before);
  const instance = {kind, node, events: new Map(), props: {}, children: [], vnode};
  applyProps(instance, {}, vnode.props);
  instance.children = reconcileChildren(node, [], vnode.children, null);
  return instance;
}

function unmountInstance(instance) {
  if (!instance || instance.kind === 'empty') return;
  if (instance.kind === 'text') {
    instance.node.remove();
    return;
  }
  if (instance.kind === 'element') {
    for (const child of instance.children) unmountInstance(child);
    for (const [event, handler] of instance.events) instance.node.removeEventListener(event, handler);
    const refValue = instance.props.ref;
    if (refValue?.current === instance.node) refValue.current = null;
    instance.node.remove();
    return;
  }
  for (const child of instance.children) unmountInstance(child);
  instance.start.remove();
  instance.end.remove();
}

function compatible(instance, vnode) {
  const kind = instanceKind(vnode);
  return instance?.kind === kind && (kind !== 'element' || instance.vnode.tag === vnode.tag);
}

function patchInstance(parent, instance, vnode, before = null) {
  if (!instance) return mountInstance(parent, vnode, before);
  if (!compatible(instance, vnode)) {
    const nextNode = lastNode(instance)?.nextSibling || before;
    unmountInstance(instance);
    return mountInstance(parent, vnode, nextNode);
  }
  if (instance.kind === 'empty') {
    instance.vnode = vnode;
    return instance;
  }
  if (instance.kind === 'text') {
    if (instance.node.nodeValue !== vnode) instance.node.nodeValue = vnode;
    instance.vnode = vnode;
    return instance;
  }
  if (instance.kind === 'fragment') {
    instance.children = reconcileChildren(parent, instance.children, vnode.children, instance.end);
    instance.vnode = vnode;
    return instance;
  }
  applyProps(instance, instance.props, vnode.props);
  instance.children = reconcileChildren(instance.node, instance.children, vnode.children, null);
  instance.vnode = vnode;
  return instance;
}

function childIdentity(vnode, index) {
  const key = vnode && typeof vnode === 'object' ? vnode.key : undefined;
  return key == null ? `index:${index}` : `key:${typeof key}:${String(key)}`;
}

function reconcileChildren(parent, previous, next, boundary) {
  const available = new Map();
  previous.forEach((instance, index) => {
    const identity = childIdentity(instance.vnode, index);
    if (available.has(identity)) throw new Error(`Duplicate Teptop child key: ${identity.slice(4)}`);
    available.set(identity, instance);
  });
  const seen = new Set();
  const children = next.map((vnode, index) => {
    const identity = childIdentity(vnode, index);
    if (seen.has(identity)) throw new Error(`Duplicate Teptop child key: ${identity.slice(4)}`);
    seen.add(identity);
    const old = available.get(identity);
    available.delete(identity);
    return patchInstance(parent, old, vnode, boundary);
  });
  available.forEach(unmountInstance);
  let reference = boundary;
  for (let index = children.length - 1; index >= 0; index--) {
    const child = children[index];
    const first = firstNode(child);
    const last = lastNode(child);
    if (!first) continue;
    if (last.nextSibling !== reference) insertRange(parent, child, reference);
    reference = first;
  }
  return children;
}

function mismatch(path, expected, node) {
  const actual = !node ? 'end of children' : node.nodeType === 1 ? `<${node.localName}>` : node.nodeType === 3 ? 'text node' : `comment ${JSON.stringify(node.nodeValue)}`;
  throw new HydrationMismatchError(path, expected, actual);
}

function verifyHydrationList(children, parent, first, stopAt, path) {
  let node = first;
  for (let index = 0; index < children.length; index++) {
    const vnode = children[index];
    const childPath = `${path}.${index}`;
    if (vnode === EMPTY) continue;
    if (isFragment(vnode)) {
      if (node?.nodeType !== 8 || node.nodeValue !== 'teptop:fragment:start') mismatch(childPath, 'fragment start marker', node);
      const end = findFragmentEnd(node.nextSibling, stopAt);
      if (!end) mismatch(childPath, 'fragment end marker', null);
      verifyHydrationList(vnode.children, parent, node.nextSibling, end, childPath);
      node = end.nextSibling;
      continue;
    }
    if (typeof vnode === 'string') {
      if (node?.nodeType === 8 && node.nodeValue === 'teptop:text') {
        if (node.nextSibling?.nodeType !== 3) mismatch(childPath, 'text node after text marker', node.nextSibling);
        node = node.nextSibling.nextSibling;
      } else {
        if (node?.nodeType !== 3) mismatch(childPath, 'text node', node);
        node = node.nextSibling;
      }
      continue;
    }
    if (node?.nodeType !== 1 || node.localName !== vnode.tag.toLowerCase()) mismatch(childPath, `<${vnode.tag}>`, node);
    verifyHydrationList(vnode.children, node, node.firstChild, null, childPath);
    node = node.nextSibling;
  }
  if (node !== stopAt) mismatch(path, 'no extra server nodes', node);
}

function findFragmentEnd(node, stopAt) {
  let depth = 0;
  while (node && node !== stopAt) {
    if (node.nodeType === 8 && node.nodeValue === 'teptop:fragment:start') depth++;
    if (node.nodeType === 8 && node.nodeValue === 'teptop:fragment:end') {
      if (depth === 0) return node;
      depth--;
    }
    node = node.nextSibling;
  }
  return null;
}

function adoptHydratedList(children, parent, first, stopAt, components) {
  let node = first;
  return children.map(vnode => {
    if (vnode === EMPTY) return {kind: 'empty', vnode};
    if (isFragment(vnode)) {
      const start = node;
      const end = findFragmentEnd(start.nextSibling, stopAt);
      const instance = {kind: 'fragment', start, end, children: [], vnode};
      instance.children = adoptHydratedList(vnode.children, parent, start.nextSibling, end, components);
      node = end.nextSibling;
      return instance;
    }
    if (typeof vnode === 'string') {
      if (node?.nodeType === 8 && node.nodeValue === 'teptop:text') {
        const textNode = node.nextSibling;
        const instance = {kind: 'text', node: textNode, vnode};
        textNode.nodeValue = vnode;
        node = textNode.nextSibling;
        return instance;
      }
      const instance = {kind: 'text', node, vnode};
      node.nodeValue = vnode;
      node = node.nextSibling;
      return instance;
    }
    const element = node;
    const instance = {kind: 'element', node: element, events: new Map(), props: {}, children: [], vnode};
    applyProps(instance, {}, vnode.props);
    instance.children = adoptHydratedList(vnode.children, element, element.firstChild, null, components);
    node = node.nextSibling;
    return instance;
  });
}

function renderInto(view, target, hydrateExisting = false) {
  if (!target) throw new Error('Teptop render target was not found.');
  let current = null;
  let components = new Set();
  let destroyed = false;
  const stop = effect(() => {
    if (destroyed) return;
    const previousActive = activeComponents;
    const nextComponents = new Set();
    activeComponents = nextComponents;
    let next;
    try { next = normalize(view); }
    finally { activeComponents = previousActive; }
    if (hydrateExisting) {
      verifyHydrationList([next], target, target.firstChild, null, 'root');
      const rootParent = target.ownerDocument.createDocumentFragment();
      current = adoptHydratedList([next], rootParent, target.firstChild, null, nextComponents)[0];
      hydrateExisting = false;
    } else {
      current = patchInstance(target, current, next, null);
    }
    components.forEach(component => { if (!nextComponents.has(component)) component.dispose(); });
    components = nextComponents;
  });
  return {
    element: () => firstNode(current),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stop();
      unmountInstance(current);
      components.forEach(component => component.dispose());
      components.clear();
      current = null;
    },
  };
}

export function render(view, target) {
  return renderInto(view, target);
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
  let app = target.firstChild ? renderInto(view, target, true) : render(view, target);
  return {
    element: () => app.element(),
    render(nextView) { app.destroy(); app = render(nextView, target); return app; },
    unmount() { app.destroy(); },
    destroy() { app.destroy(); },
  };
}

export function createRouter(routes, target) {
  const path = signal(globalThis.location?.pathname || '/');
  const navigate = nextPath => {
    if (globalThis.history) globalThis.history.pushState({}, '', nextPath);
    path.set(nextPath);
  };
  const matchRoute = currentPath => {
    for (const [pattern, route] of Object.entries(routes)) {
      if (pattern === '*') continue;
      const names = [];
      const expression = new RegExp(`^${pattern.replace(/:[^/]+/g, name => { names.push(name.slice(1)); return '([^/]+)'; })}$`);
      const match = currentPath.match(expression);
      if (match) return {pattern, route, match, names};
    }
    return null;
  };
  const view = () => {
    const result = matchRoute(path());
    const route = result ? result.pattern : routes[path()] ? path() : '*';
    const params = result ? Object.fromEntries(result.names.map((name, index) => [name, result.match[index + 1]])) : {};
    return routes[route]({path: path(), params, navigate});
  };
  const onPopState = () => path.set(globalThis.location.pathname);
  globalThis.addEventListener?.('popstate', onPopState);
  const app = render(view, target);
  return {path, navigate, destroy: () => { globalThis.removeEventListener?.('popstate', onPopState); app.destroy(); }};
}

export const version = '0.0.4';

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
