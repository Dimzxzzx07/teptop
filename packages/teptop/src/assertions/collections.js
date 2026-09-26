export const isArrayLike = value => Array.isArray(value) || typeof value?.length === 'number'; export const nonEmpty = value => isArrayLike(value) && value.length > 0;
