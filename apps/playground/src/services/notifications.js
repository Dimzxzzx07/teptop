import {signal} from 'teptop.js';
export const notifications = signal([]);
export const notify = message => notifications.update(items => [...items, {message, at: Date.now()}]);
