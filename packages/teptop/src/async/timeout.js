export const timeout = (promise, milliseconds) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out')), milliseconds))]);
