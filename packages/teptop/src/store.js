import {signal, batch} from './index.js';

const clone = value => structuredClone(value);

export function createAdvancedStore(initialState, options = {}) {
  const initial = clone(initialState);
  const state = signal(clone(initial));
  const history = [];
  const future = [];
  const middlewares = options.middleware || [];
  const actions = options.actions || {};
  const notify = (event, next, previous) => middlewares.forEach(middleware => middleware({event, next, previous, store}));
  const store = {
    state,
    history,
    future,
    dispatch(type, payload) {
      const action = actions[type];
      if (typeof action !== 'function') throw new Error(`Unknown Teptop action: ${type}`);
      const previous = state.peek();
      const next = action(clone(previous), payload);
      history.push(previous);
      future.length = 0;
      batch(() => state.set(next));
      notify({type, payload}, next, previous);
      return next;
    },
    patch(updates) { return store.dispatch('__patch__', updates); },
    undo() {
      const previous = history.pop();
      if (previous === undefined) return false;
      future.push(state.peek());
      state.set(previous);
      return true;
    },
    redo() {
      const next = future.pop();
      if (next === undefined) return false;
      history.push(state.peek());
      state.set(next);
      return true;
    },
    reset() { state.set(clone(initial)); history.length = 0; future.length = 0; },
    select(selector) { return selector(state()); },
    snapshot() { return clone(state()); },
    hydrate(snapshot) { state.set(clone(snapshot)); },
  };
  const originalPatch = options.actions?.__patch__;
  if (!originalPatch) actions.__patch__ = (current, updates) => ({...current, ...updates});
  if (options.onCreate) options.onCreate(store);
  return store;
}

export function persistStore(store, storage, key) {
  const saved = storage.getItem(key);
  if (saved) store.hydrate(JSON.parse(saved));
  return store.state.subscribe(() => storage.setItem(key, JSON.stringify(store.snapshot())));
}
