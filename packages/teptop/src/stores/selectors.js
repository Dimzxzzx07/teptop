export const selectState = (store, selector) => () => selector(store.state());
