const isFunction = value => typeof value === 'function';

export function createEmitter(options = {}) {
  const listeners = new Map();
  const wildcard = new Set();
  const once = new WeakMap();
  const history = options.history ? [] : null;

  const on = (event, listener) => {
    if (!isFunction(listener)) throw new TypeError('Teptop event listeners must be functions.');
    const bucket = event === '*' ? wildcard : (listeners.get(event) || new Set());
    bucket.add(listener);
    if (event !== '*') listeners.set(event, bucket);
    return () => off(event, listener);
  };

  const off = (event, listener) => {
    const bucket = event === '*' ? wildcard : listeners.get(event);
    if (!bucket) return false;
    const removed = bucket.delete(listener);
    if (event !== '*' && bucket.size === 0) listeners.delete(event);
    return removed;
  };

  const emit = (event, payload) => {
    const record = {event, payload, timestamp: Date.now()};
    history?.push(record);
    const callbacks = [...(listeners.get(event) || []), ...wildcard];
    callbacks.forEach(listener => listener(payload, record));
    return callbacks.length;
  };

  const subscribeOnce = (event, listener) => {
    const wrapped = (payload, record) => {
      off(event, wrapped);
      once.delete(listener);
      listener(payload, record);
    };
    once.set(listener, wrapped);
    return on(event, wrapped);
  };

  return {
    on,
    off,
    once: subscribeOnce,
    emit,
    clear(event) { if (event === undefined) { listeners.clear(); wildcard.clear(); } else listeners.delete(event); },
    listenerCount(event) { return event === '*' ? wildcard.size : (listeners.get(event)?.size || 0); },
    events() { return [...listeners.keys()]; },
    history: history ? () => history.slice() : undefined,
  };
}

export function createEventStore(initialState = {}) {
  const emitter = createEmitter({history: true});
  let state = structuredClone(initialState);
  return {
    events: emitter,
    getState: () => state,
    update(updater, event = 'change') {
      const previous = state;
      state = structuredClone(isFunction(updater) ? updater(structuredClone(state)) : {...state, ...updater});
      emitter.emit(event, {state, previous});
      return state;
    },
    reset() { return this.update(() => structuredClone(initialState), 'reset'); },
  };
}