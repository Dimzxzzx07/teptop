export const encodeHex = value => Buffer.from(String(value)).toString('hex'); export const decodeHex = value => Buffer.from(value, 'hex').toString();
