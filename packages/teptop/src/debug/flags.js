export const debugFlags = {render: false, effects: false, scheduler: false};
export const enableDebug = (...flags) => flags.forEach(flag => { debugFlags[flag] = true; });
