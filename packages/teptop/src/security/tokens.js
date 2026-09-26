export const createToken = (prefix = 'teptop') => `${prefix}-${Math.random().toString(36).slice(2)}`;
