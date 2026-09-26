import {h} from '/teptop.js';
export const EmptyState = ({message = 'Nothing to display'}) => h('div', {className: 'empty-state'}, message);
