import {h} from 'teptop.js';
import {JsxBadge} from './JsxBadge.tsx';

export function ShellHeader() {
  return h('header', {className: 'topbar'}, h('div', {className: 'brand'}, h('div', {className: 'mark'}, 'T'), h('div', null, h('h1', null, 'Teptop Control Room'), h('p', {className: 'muted'}, 'Signal-first application runtime'))), h(JsxBadge), h('span', {className: 'pill'}, 'v0.0.4 online'));
}
