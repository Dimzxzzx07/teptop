import {signal} from 'teptop.js'; export const benchmarkSignal = iterations => { const value = signal(0); for (let index = 0; index < iterations; index++) value.set(index); return value(); };
