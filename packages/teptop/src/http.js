const defaultHeaders = {'accept': 'application/json'};

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function parseResponse(response) {
  const contentType = response.headers?.get?.('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  const text = await response.text();
  try { return JSON.parse(text); } catch { return text; }
}

export class HttpError extends Error {
  constructor(message, response, data) {
    super(message);
    this.name = 'HttpError';
    this.status = response?.status;
    this.statusText = response?.statusText;
    this.data = data;
    this.response = response;
  }
}

export function createHttpClient(options = {}) {
  const baseURL = options.baseURL || '';
  const defaults = {...defaultHeaders, ...(options.headers || {})};
  const before = [];
  const after = [];
  const failed = [];

  const use = interceptor => {
    if (interceptor?.request) before.push(interceptor.request);
    if (interceptor?.response) after.push(interceptor.response);
    if (interceptor?.error) failed.push(interceptor.error);
    return () => {
      [before, after, failed].forEach(bucket => {
        const index = bucket.indexOf(interceptor.request || interceptor.response || interceptor.error);
        if (index >= 0) bucket.splice(index, 1);
      });
    };
  };

  const request = async (path, config = {}) => {
    const method = (config.method || 'GET').toUpperCase();
    const url = new URL(path, baseURL || globalThis.location?.origin || 'http://localhost');
    Object.entries(config.query || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, value);
    });
    const controller = new AbortController();
    const timeout = config.timeout ?? options.timeout;
    const timer = timeout ? setTimeout(() => controller.abort(new Error('Request timed out')), timeout) : undefined;
    let requestConfig = {method, headers: {...defaults, ...(config.headers || {})}, signal: config.signal || controller.signal};
    if (config.body !== undefined) {
      requestConfig.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
      requestConfig.headers['content-type'] ||= 'application/json';
    }
    try {
      for (const interceptor of before) requestConfig = await interceptor({url: url.href, config: requestConfig}) || requestConfig;
      let response;
      let attempt = 0;
      const retries = config.retries ?? options.retries ?? 0;
      do {
        try { response = await (config.fetch || options.fetch || globalThis.fetch)(url, requestConfig); }
        catch (error) {
          if (attempt >= retries) throw error;
          await wait((config.retryDelay || 50) * 2 ** attempt);
        }
        attempt++;
      } while (!response && attempt <= retries);
      let data = await parseResponse(response);
      if (!response.ok) throw new HttpError(`Teptop HTTP ${response.status}`, response, data);
      for (const interceptor of after) data = await interceptor(data, response) ?? data;
      return data;
    } catch (error) {
      let current = error;
      for (const interceptor of failed) current = await interceptor(current) ?? current;
      throw current;
    } finally { if (timer) clearTimeout(timer); }
  };

  const client = (path, config) => request(path, config);
  ['get', 'delete', 'head'].forEach(method => { client[method] = (path, config) => request(path, {...config, method}); });
  ['post', 'put', 'patch'].forEach(method => { client[method] = (path, body, config) => request(path, {...config, method, body}); });
  client.request = request;
  client.use = use;
  return client;
}