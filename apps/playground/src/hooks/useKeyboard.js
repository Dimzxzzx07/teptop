import {effect} from '/teptop.js';
export const useKeyboard = (key, handler) => effect(() => { const listener = event => event.key === key && handler(event); addEventListener('keydown', listener); return () => removeEventListener('keydown', listener); });
