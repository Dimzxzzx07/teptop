import {h} from 'teptop.js';
export const Toast = ({message, visible = true}) => visible ? h('div', {className: 'toast', role: 'status'}, message) : h('teptop-empty');
