export const response = (body, status = 200) => ({ok: status >= 200 && status < 300, status, headers: {get: () => 'application/json'}, json: async () => body});
