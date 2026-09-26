export const encodeBody = body => typeof body === 'string' ? body : JSON.stringify(body);
