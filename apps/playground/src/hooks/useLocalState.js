import {signal} from 'teptop.js';
export const useLocalState = (key, initial) => { const value = signal(JSON.parse(localStorage.getItem(key) || 'null') ?? initial); value.subscribe(() => localStorage.setItem(key, JSON.stringify(value()))); return value; };
