import {createEmitter} from '/teptop.js';
export const analytics = createEmitter({history: true});
export const track = (event, payload) => analytics.emit(event, payload);
