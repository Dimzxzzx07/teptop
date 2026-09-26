export const assertText = (element, expected) => { if (!element?.textContent?.includes(expected)) throw new Error(`Expected text: ${expected}`); return element; };
export const assertAttribute = (element, name, expected) => { if (element?.getAttribute(name) !== expected) throw new Error(`Expected ${name}=${expected}`); return element; };
