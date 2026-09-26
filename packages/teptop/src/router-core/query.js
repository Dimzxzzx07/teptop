export const routeQuery = path => Object.fromEntries(new URL(path, 'http://localhost').searchParams);
