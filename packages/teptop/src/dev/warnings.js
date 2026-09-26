export const warnOnce = (() => { const seen = new Set(); return (key, sink = console) => { if (seen.has(key)) return; seen.add(key); sink.warn?.(key); }; })();
