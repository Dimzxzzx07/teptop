export const now = () => Date.now();
export const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
