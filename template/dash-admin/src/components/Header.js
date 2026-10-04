import {h} from '/runtime/index.js';

export function Header({title, user, onMenu, onLogout}) {
  const initials = (user?.username || 'Admin').split(/[@._-]/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
  return h('header', {className: 'topbar'},
    h('div', {className: 'crumb-wrap'}, h('button', {className: 'mobile-toggle', onclick: onMenu, 'aria-label': 'Open navigation'}, '≡'), h('div', {className: 'crumb'}, 'Fieldnote', h('span', null, ' / '), h('strong', null, title))),
    h('div', {className: 'top-actions'}, h('span', {className: 'live-tag'}, 'API connected'), h('button', {className: 'user-chip user-button', onclick: onLogout}, h('span', {className: 'avatar'}, initials), h('span', null, user?.username || 'Admin'))),
  );
}
