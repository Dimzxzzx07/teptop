export function createHydrationState() { let active = false; return {start: () => {active = true;}, stop: () => {active = false;}, get active() { return active; }}; }
