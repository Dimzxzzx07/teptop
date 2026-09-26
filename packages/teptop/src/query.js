import {computed, effect, signal} from './index.js';

const serialize = key => typeof key === 'string' ? key : JSON.stringify(key);

export function createQueryClient(options = {}) {
  const cache = new Map();
  const listeners = new Set();
  const staleTime = options.staleTime ?? 0;

  const notify = () => listeners.forEach(listener => listener());
  const getEntry = key => cache.get(serialize(key));
  const ensure = (key, loader, config = {}) => {
    const cacheKey = serialize(key);
    let entry = cache.get(cacheKey);
    if (!entry) {
      entry = {key, loader, state: signal({status: 'idle', data: undefined, error: undefined, updatedAt: 0}), promise: null, timer: null};
      cache.set(cacheKey, entry);
    }
    entry.loader = loader;
    entry.config = config;
    return entry;
  };
  const fetchQuery = async (key, loader, config = {}) => {
    const entry = ensure(key, loader, config);
    const current = entry.state.peek();
    if (entry.promise) return entry.promise;
    if (current.status === 'ready' && Date.now() - current.updatedAt < (config.staleTime ?? staleTime)) return current.data;
    entry.state.set({status: current.data === undefined ? 'loading' : 'refreshing', data: current.data, error: undefined, updatedAt: current.updatedAt});
    entry.promise = Promise.resolve().then(() => loader()).then(data => {
      entry.state.set({status: 'ready', data, error: undefined, updatedAt: Date.now()});
      notify();
      return data;
    }).catch(error => {
      entry.state.set({status: 'error', data: current.data, error, updatedAt: current.updatedAt});
      notify();
      throw error;
    }).finally(() => { entry.promise = null; });
    return entry.promise;
  };
  return {
    fetch: fetchQuery,
    query(key, loader, config = {}) {
      const entry = ensure(key, loader, config);
      const data = computed(() => entry.state().data);
      return {key: entry.key, state: entry.state, data, loading: computed(() => ['loading', 'refreshing'].includes(entry.state().status)), refetch: () => fetchQuery(key, loader, config), invalidate: () => { entry.state.set({...entry.state.peek(), updatedAt: 0}); return fetchQuery(key, loader, config); }};
    },
    invalidate(key) { const entry = getEntry(key); if (!entry) return false; entry.state.set({...entry.state.peek(), updatedAt: 0}); return true; },
    remove(key) { return cache.delete(serialize(key)); },
    clear() { cache.clear(); notify(); },
    keys() { return [...cache.values()].map(entry => entry.key); },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    hydrate(snapshot = {}) { Object.entries(snapshot).forEach(([key, value]) => ensure(key, () => value).state.set({status: 'ready', data: value, error: undefined, updatedAt: Date.now()})); },
    dehydrate() { return Object.fromEntries([...cache.entries()].filter(([, entry]) => entry.state.peek().status === 'ready').map(([key, entry]) => [key, entry.state.peek().data])); },
  };
}