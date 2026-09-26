export const resourceResult = (data, error = null) => ({data, error, status: error ? 'error' : 'ready'});
