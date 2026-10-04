import {createHttpClient} from 'teptop.js';
export const api = createHttpClient({baseURL: '/api', timeout: 3000});
