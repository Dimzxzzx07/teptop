import {response} from './responses.js'; export const fixtureFetch = async (url, options = {}) => response({url: String(url), method: options.method || 'GET'});
