export const workerError = message => Object.assign(new Error(message), {code: 'TEPTOP_WORKER'});
