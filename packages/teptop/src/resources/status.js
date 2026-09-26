export const isPending = state => state === 'idle' || state === 'loading'; export const isSettled = state => state === 'ready' || state === 'error';
