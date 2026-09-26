export const composeSync = handlers => value => handlers.reduce((current, handler) => handler(current), value);
