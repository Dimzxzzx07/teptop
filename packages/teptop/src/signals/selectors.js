export const select = (source, selector) => () => selector(source());
