export const span = (name, started = Date.now()) => ({name, started, finish: () => ({name, duration: Date.now() - started})});
