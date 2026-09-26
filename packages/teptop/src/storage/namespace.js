export const namespace = (storage, prefix) => ({get: key => storage.get(`${prefix}:${key}`), set: (key, value) => storage.set(`${prefix}:${key}`, value)});
