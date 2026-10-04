export function sendJSON(response, status, body, headers = {}) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(payload), 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers});
  response.end(payload);
}

export async function readJSON(request, limit = 1024 * 1024) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > limit) throw Object.assign(new Error('Request body too large.'), {status: 413});
    chunks.push(chunk);
  }
  if (!length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('Request body must be valid JSON.'), {status: 400}); }
}

export function sendError(response, status, message) {
  sendJSON(response, status, {error: {message}});
}
