export const wildcard = pattern => pattern.replace(/\*/g, '(.*)'); export const named = pattern => pattern.replace(/:([\w]+)/g, '([^/]+)');
