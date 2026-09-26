export const transact = (store, work) => { const snapshot = store.snapshot(); try { return work(store); } catch (error) { store.hydrate(snapshot); throw error; } };
