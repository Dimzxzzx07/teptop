export function createTTLCache(ttl = 60000) {
  const values = new Map();
  return {set(key, value, lifetime = ttl) { values.set(key, {value, expires: Date.now() + lifetime}); return value; }, get(key) { const entry = values.get(key); if (!entry || entry.expires < Date.now()) { values.delete(key); return undefined; } return entry.value; }, clear() { values.clear(); }};
}
