export const tokenize = source => source.match(/\{\{|\}\}|[^{}]+/g) || [];
