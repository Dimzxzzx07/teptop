async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: {'content-type': 'application/json', ...options.headers},
    ...options,
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(body?.error?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}

export const dataProvider = {
  async getIdentity() { return (await request('/api/auth/me')).user; },
  async login(username, password) { return (await request('/api/auth/login', {method: 'POST', body: JSON.stringify({username, password})})).user; },
  async logout() { return request('/api/auth/logout', {method: 'POST'}); },
  async dashboard() { return request('/api/dashboard'); },
  async getList(resource, params = {}) {
    const query = new URLSearchParams({page: params.page || 1, perPage: params.perPage || 10, q: params.q || '', status: params.status || ''});
    return request(`/api/${encodeURIComponent(resource)}?${query}`);
  },
  async getOne(resource, id) { return (await request(`/api/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`)).data; },
  async create(resource, values) { return (await request(`/api/${encodeURIComponent(resource)}`, {method: 'POST', body: JSON.stringify(values)})).data; },
  async update(resource, id, values) { return (await request(`/api/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, {method: 'PATCH', body: JSON.stringify(values)})).data; },
  async remove(resource, id) { return (await request(`/api/${encodeURIComponent(resource)}/${encodeURIComponent(id)}`, {method: 'DELETE'})).data; },
};
