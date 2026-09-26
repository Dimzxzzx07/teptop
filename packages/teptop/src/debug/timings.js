export const measure = (label, work, sink = console) => { const start = performance.now(); const result = work(); sink.debug?.(label, performance.now() - start); return result; };
