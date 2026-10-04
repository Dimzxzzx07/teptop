import {signal} from 'teptop.js';
export const useToggle = (initial = false) => { const value = signal(initial); return [value, () => value.update(current => !current)]; };
