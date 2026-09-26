export const tokenizeSource = source => source.match(/\{\{|\}\}|[^{}]+/g) || []; export const parseSource = source => ({source, tokens: tokenizeSource(source)});
