export const encodeJSON = value => JSON.stringify(value, (_, current) => current instanceof Set ? {type: 'Set', values: [...current]} : current);
export const decodeJSON = source => JSON.parse(source, (_, current) => current?.type === 'Set' ? new Set(current.values) : current);
