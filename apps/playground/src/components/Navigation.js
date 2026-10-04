import {h} from 'teptop.js';

export function Navigation({path, navigate}) {
  return h('nav', {className: 'toolbar'}, h('button', {className: `nav${path === '/' ? ' active' : ''}`, onclick: () => navigate('/')}, 'Overview'), h('button', {className: `nav${path === '/settings' ? ' active' : ''}`, onclick: () => navigate('/settings')}, 'Settings'));
}
