export const composeAsync = handlers => value => handlers.reduce((promise, handler) => promise.then(handler), Promise.resolve(value));
