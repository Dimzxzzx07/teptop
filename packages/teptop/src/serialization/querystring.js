export function encodeQuery(values = {}) { const query = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => value != null && query.set(key, value)); return query.toString(); }
export const decodeQuery = source => Object.fromEntries(new URLSearchParams(source));
