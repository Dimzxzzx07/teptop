import {h} from '/teptop.js';
export const Modal = ({open, title, close, children}) => open ? h('div', {className: 'modal'}, h('div', {className: 'modal-panel'}, h('button', {onclick: close}, 'Close'), h('h2', null, title), children)) : h('teptop-empty');
