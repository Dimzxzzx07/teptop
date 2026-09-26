export const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']; export const normalizeMethod = method => String(method || 'GET').toUpperCase();
