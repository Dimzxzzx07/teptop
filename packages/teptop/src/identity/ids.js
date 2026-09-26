let next = 0; export const createId = (prefix = 'id') => `${prefix}-${++next}`;
