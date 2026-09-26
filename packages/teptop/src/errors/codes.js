export const errorCodes = {UNKNOWN: 'TEPTOP_UNKNOWN', NETWORK: 'TEPTOP_NETWORK', VALIDATION: 'TEPTOP_VALIDATION', RENDER: 'TEPTOP_RENDER'};
export const isTeptopError = error => Boolean(error?.code?.startsWith('TEPTOP_'));
