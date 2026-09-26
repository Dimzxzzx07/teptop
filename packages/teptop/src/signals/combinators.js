export const all = sources => () => sources.map(source => source()); export const any = sources => () => sources.some(source => source());
