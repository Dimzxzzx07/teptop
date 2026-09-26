import {h} from '/teptop.js';

export function ShellHeader() {
  return h('header', {className: 'topbar'}, h('div', {className: 'brand'}, h('div', {className: 'mark'}, 'T'), h('div', null, h('h1', null, 'Teptop Control Room'), h('p', {className: 'muted'}, 'Signal-first application runtime'))), h('span', {className: 'pill'}, 'v1.3 online'));
}
