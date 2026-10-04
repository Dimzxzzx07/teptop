import {h} from '/runtime/index.js';
import {resourceConfig} from '../config/resources.js';

export function Sidebar({route, open, onNavigate, onLogout}) {
  const link = (path, label, icon, count) => h('button', {className: `nav-link${route === path ? ' active' : ''}`, onclick: () => onNavigate(path)}, h('span', {className: 'nav-icon'}, icon), h('span', null, label), count != null && h('span', {className: 'nav-count'}, count));
  return h('aside', {className: `sidebar${open ? ' open' : ''}`},
    h('div', {className: 'brand'}, h('div', {className: 'brand-mark'}, 'F'), h('div', null, h('div', {className: 'brand-name'}, 'Fieldnote'), h('div', {className: 'brand-caption'}, 'Commerce workspace'))),
    h('div', {className: 'nav-label'}, 'Workspace'),
    h('nav', {className: 'nav-list', 'aria-label': 'Main navigation'},
      link('/', 'Overview', 'OV'),
      ...Object.entries(resourceConfig).map(([key, config]) => link(`/${key}`, config.label, config.icon)),
    ),
    h('div', {className: 'sidebar-bottom'}, h('strong', null, 'TEPTOP ADMIN'), h('br'), 'Local demo · Node API', h('button', {className: 'sidebar-logout', onclick: onLogout}, 'Sign out')),
  );
}
