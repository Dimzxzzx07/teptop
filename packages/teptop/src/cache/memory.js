export function createMemoryCache() {
  const values = new Map();
  return {get: key => values.get(key), has: key => values.has(key), set(key, value) { values.set(key, value); return value; }, delete: key => values.delete(key), clear: () => values.clear(), keys: () => [...values.keys()]};
}
