import {devtools, trace} from 'teptop.js/devtools';

export function createInspector(name = 'teptop-app') {
  const tool = devtools(name);
  return {
    name,
    record(label, value) { tool.record(label, value); return value; },
    trace(label, work) { return trace(label, work, tool); },
    snapshot() { return tool.snapshot(); },
    clear() { tool.clear?.(); },
  };
}

export function createPerformanceReporter(inspector, sink = console) {
  return async function report(label, work) {
    const started = performance.now();
    try { return await work(); }
    finally { sink.info?.(`[teptop:${inspector.name}] ${label}`, `${(performance.now() - started).toFixed(2)}ms`); }
  };
}
