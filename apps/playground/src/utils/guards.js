export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';
export const assertBrowser = () => { if (!isBrowser()) throw new Error('Playground requires a browser.'); };
