export const pluginHook = (plugin, hook, ...args) => plugin?.[hook]?.(...args);
