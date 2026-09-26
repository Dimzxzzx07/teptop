export function createFixture(factory, cleanup = () => {}) { const value = factory(); return {value, dispose() { cleanup(value); }}; }
