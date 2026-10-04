import {signal} from 'teptop.js';
export const useAsyncStatus = () => signal({status: 'idle', error: null});
