import {resource} from 'teptop.js';
export const health = resource(async () => ({status: 'healthy', latency: 42}));
