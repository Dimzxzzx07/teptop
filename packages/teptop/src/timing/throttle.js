export function throttle(work, interval = 0) { let last = 0; return (...args) => { const now = Date.now(); if (now - last >= interval) { last = now; return work(...args); } }; }
