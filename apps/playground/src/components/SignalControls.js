import {h} from 'teptop.js';
import {incrementVisits} from '../state/dashboard.js';

export function SignalControls() {
  return h('section', {className: 'activity'}, h('h2', null, 'Signal controls'), h('p', {className: 'muted'}, 'Every value below is driven by a Teptop signal.'), h('button', {className: 'nav active', onclick: incrementVisits}, 'Simulate session'));
}
