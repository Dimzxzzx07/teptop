export const retryDelay = (attempt, base = 100) => base * 2 ** attempt;
