export const readClipboard = navigator => navigator?.clipboard?.readText?.() || Promise.resolve('');
