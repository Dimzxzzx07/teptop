import {h} from '/teptop.js';
export const DataTable = ({rows = []}) => h('div', {className: 'data-table'}, rows.map(row => h('div', {className: 'data-row', key: row.id}, h('strong', null, row.name), h('span', null, row.value))));
