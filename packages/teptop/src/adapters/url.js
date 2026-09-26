export const absoluteURL = (path, base = 'http://localhost') => new URL(path, base).href;
