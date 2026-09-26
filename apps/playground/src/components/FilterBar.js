import {h} from '/teptop.js';
export const FilterBar = ({value, onInput}) => h('label', {className: 'filter-bar'}, 'Filter', h('input', {value, oninput: event => onInput(event.target.value), placeholder: 'Search modules'}));
