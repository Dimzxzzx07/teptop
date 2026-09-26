const events = [];

export function devtools(label = 'teptop') {
  const api = {
    label,
    events,
    record(type, payload) { events.push({type, payload, at: Date.now()}); },
    clear() { events.length = 0; },
    snapshot() { return events.map(event => ({...event})); },
    inspect(value) { return {label, value, keys: value && typeof value === 'object' ? Object.keys(value) : []}; },
  };
  if (globalThis.__TEPTOP_DEVTOOLS__) globalThis.__TEPTOP_DEVTOOLS__.push(api);
  else globalThis.__TEPTOP_DEVTOOLS__ = [api];
  return api;
}

export function trace(name, work, tool = devtools()) {
  const start = performance.now();
  try { return work(); } finally { tool.record(name, {duration: performance.now() - start}); }
}
