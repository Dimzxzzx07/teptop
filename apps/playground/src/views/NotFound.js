import {h} from '/teptop.js';
export const NotFound = () => h('section', {className: 'activity'}, h('h2', null, 'Route not found'), h('p', {className: 'muted'}, 'The requested playground view does not exist.'));
