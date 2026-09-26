export const encodeBase64 = value => Buffer.from(String(value)).toString('base64'); export const decodeBase64 = value => Buffer.from(value, 'base64').toString();
