export function createMetrics() { const values = new Map(); return {increment: key => values.set(key, (values.get(key) || 0) + 1), read: key => values.get(key) || 0}; }
