export const resolveToken = (token, scope) => token.startsWith('{{') ? token.slice(2, -2).trim().split('.').reduce((value, key) => value?.[key], scope) : token;
