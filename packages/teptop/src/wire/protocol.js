export const protocolVersion = '1'; export const packet = (type, data) => ({version: protocolVersion, type, data});
