import {h} from 'teptop.js';
export const ProgressBar = ({value = 0}) => h('div', {className: 'progress'}, h('span', {style: {width: `${value}%`}}));
