export const middlewareError = message => Object.assign(new Error(message), {code: 'TEPTOP_MIDDLEWARE'});
