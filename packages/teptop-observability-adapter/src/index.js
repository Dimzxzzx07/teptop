const domain = 'observability';
const concept = 'adapter';

export function createObservabilityAdapter(options = {}) {
  const state = {domain, concept, options: {...options}, createdAt: Date.now(), events: []};
  return {
    domain,
    concept,
    state,
    configure(values) { Object.assign(state.options, values); return this; },
    emit(type, payload) { const event = {type, payload, at: Date.now()}; state.events.push(event); return event; },
    history() { return state.events.slice(); },
    reset() { state.events.length = 0; return this; },
    describe() { return {name: '@teptop/observability-adapter', domain, concept}; },
  };
}

export const observabilityAdapterMetadata = {domain, concept, package: '@teptop/observability-adapter'};
