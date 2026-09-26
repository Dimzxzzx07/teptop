export const cacheKey = (key, args = []) => JSON.stringify([key, ...args]);
