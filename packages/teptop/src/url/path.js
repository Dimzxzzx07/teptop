export const joinPath = (...parts) => parts.join('/').replace(/\/+/g, '/').replace(/([^:])\/\//g, '$1/');
export const normalizePath = path => `/${path.replace(/^\/+|\/+$/g, '')}`.replace('//', '/') || '/';
