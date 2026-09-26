import {h} from '/teptop.js';
export const StatusBadge = ({status = 'healthy'}) => h('span', {className: `status status-${status}`}, status);
