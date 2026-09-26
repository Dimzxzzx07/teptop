import {h} from '/teptop.js';

export function Settings() {
  return h('section', {className: 'activity settings'}, h('h2', null, 'Runtime settings'), h('p', {className: 'muted'}, 'Teptop renders this view with direct DOM patches, keyed rows, async resources, and browser routing.'), h('div', {className: 'settings-list'}, h('span', null, 'Renderer'), h('strong', null, 'Direct DOM patches'), h('span', null, 'Scheduler'), h('strong', null, 'Microtask priority queue'), h('span', null, 'Data layer'), h('strong', null, 'Signals and resources')));
}
