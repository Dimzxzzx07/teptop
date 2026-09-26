import {signal} from '../index.js';
export function createLocale(initial = 'en') { const current = signal(initial); return {current, set: value => current.set(value), is: value => current() === value, direction: () => ['ar', 'he', 'fa'].includes(current()) ? 'rtl' : 'ltr'}; }
