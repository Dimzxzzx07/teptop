export const markTouched = fields => Object.fromEntries(Object.keys(fields).map(key => [key, true]));
