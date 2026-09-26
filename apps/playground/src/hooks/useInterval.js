import {effect} from '/teptop.js';
export const useInterval = (work, delay) => effect(() => { const timer = setInterval(work, delay); return () => clearInterval(timer); });
