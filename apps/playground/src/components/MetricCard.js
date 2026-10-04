import {h} from 'teptop.js';

export function MetricCard({label, value, change, tone = 'up'}) {
  return h('article', {className: 'metric'}, label, h('strong', null, value), h('span', {className: tone}, change));
}
