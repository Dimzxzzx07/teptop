import {h} from '/teptop.js';
export const Sparkline = ({points = []}) => h('div', {className: 'sparkline', 'data-points': points.join(',')}, points.map(point => h('i', {style: {height: `${point}%`}, key: point})));
