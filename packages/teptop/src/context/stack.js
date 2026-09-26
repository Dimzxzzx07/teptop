export function createStack(initial) { const values = [initial]; return {read: () => values.at(-1), push: value => values.push(value), pop: () => values.pop()}; }
