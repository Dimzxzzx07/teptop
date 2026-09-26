export function createPluginRegistry() { const plugins = []; return {add: plugin => (plugins.push(plugin), plugin), all: () => plugins.slice(), clear: () => plugins.splice(0)}; }
