import {h} from 'teptop.js';
export const Drawer = ({open, children}) => open ? h('aside', {className: 'drawer'}, children) : h('teptop-empty');
