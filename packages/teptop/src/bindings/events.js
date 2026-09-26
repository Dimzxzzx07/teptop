export const eventName = name => name.startsWith('on') ? name.slice(2).toLowerCase() : name;
