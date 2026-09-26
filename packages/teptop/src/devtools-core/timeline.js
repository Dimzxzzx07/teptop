export function createTimeline() { const entries = []; return {push: entry => entries.push(entry), read: () => entries.slice()}; }
