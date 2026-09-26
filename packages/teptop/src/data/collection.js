import {batch, computed, signal} from '../index.js';

const clone = value => structuredClone(value);
const defaultId = (item, index) => item?.id ?? index;

export function createCollection(initialItems = [], options = {}) {
  const getId = options.getId || defaultId;
  const state = signal({items: clone(initialItems), selected: new Set(), status: 'idle', error: undefined});
  const query = signal('');
  const sort = signal(null);
  const visible = computed(() => {
    const current = state();
    const needle = query().trim().toLowerCase();
    const sorter = sort();
    let items = current.items.filter(item => !needle || JSON.stringify(item).toLowerCase().includes(needle));
    if (sorter) items = items.slice().sort((left, right) => sorter(left, right));
    return items;
  });
  const update = updater => state.update(current => ({...current, ...(typeof updater === 'function' ? updater(current) : updater)}));
  const api = {
    state,
    items: computed(() => state().items),
    visible,
    query,
    selected: computed(() => [...state().selected]),
    status: computed(() => state().status),
    setQuery(value) { query.set(value); return api; },
    sortBy(compare) { sort.set(() => compare); return api; },
    add(item) { update(current => ({items: [...current.items, clone(item)]})); return item; },
    update(id, changes) {
      let updated;
      update(current => ({items: current.items.map((item, index) => {
        if (getId(item, index) !== id) return item;
        updated = {...item, ...(typeof changes === 'function' ? changes(item) : changes)};
        return updated;
      })}));
      return updated;
    },
    remove(id) { let removed; update(current => ({items: current.items.filter((item, index) => { const match = getId(item, index) === id; if (match) removed = item; return !match; }), selected: new Set([...current.selected].filter(value => value !== id))})); return removed; },
    select(id, selected = true) { update(current => { const next = new Set(current.selected); selected ? next.add(id) : next.delete(id); return {selected: next}; }); return api; },
    toggle(id) { return api.select(id, !state.peek().selected.has(id)); },
    clearSelection() { update({selected: new Set()}); return api; },
    replace(items) { update({items: clone(items), status: 'ready', error: undefined}); return api; },
    async load(loader) {
      update({status: 'loading', error: undefined});
      try { const items = await loader(); api.replace(items); return items; }
      catch (error) { update({status: 'error', error}); throw error; }
    },
    reset() { batch(() => { query.set(''); sort.set(null); state.set({items: clone(initialItems), selected: new Set(), status: 'idle', error: undefined}); }); return api; },
  };
  return api;
}
