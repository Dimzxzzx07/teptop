export const marker = id => `teptop:${id}`; export const isMarker = value => typeof value === 'string' && value.startsWith('teptop:');
