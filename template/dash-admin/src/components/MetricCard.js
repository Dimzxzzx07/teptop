import {h} from '/runtime/index.js';

export function MetricCard({label, value, note, trend}) {
  return h('article', {className: 'metric'}, h('div', {className: 'metric-label'}, label), h('div', {className: 'metric-value'}, value), h('div', {className: 'metric-foot'}, h('span', {className: 'metric-trend'}, trend || ''), h('span', null, note || 'Current workspace')));
}
