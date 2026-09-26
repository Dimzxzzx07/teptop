export const matchesMedia = query => globalThis.matchMedia?.(query)?.matches ?? false;
