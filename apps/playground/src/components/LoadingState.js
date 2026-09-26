import {h} from '/teptop.js';
export const LoadingState = ({label = 'Loading'}) => h('div', {className: 'loading-state', 'aria-busy': 'true'}, `${label}...`);
