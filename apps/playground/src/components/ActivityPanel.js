import {h} from '/teptop.js';

export function ActivityPanel({activity}) {
  return h('section', {className: 'activity'}, h('h2', null, 'Live activity'), () => {
    const state = activity.state();
    if (state.status === 'loading') return h('p', {className: 'muted'}, 'Syncing activity...');
    if (state.status === 'error') return h('p', {className: 'error'}, 'Activity unavailable');
    return state.status === 'ready' ? state.data.map(([name, tag, time], index) => h('div', {className: 'row', key: tag + index}, h('span', null, name), h('span', {className: 'pill'}, `${tag} · ${time}`))) : h('p', {className: 'muted'}, 'No activity yet');
  });
}
