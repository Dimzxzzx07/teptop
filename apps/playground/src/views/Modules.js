import {h} from '/teptop.js';
import {modules} from '../data/modules.js';
import {DataTable} from '../components/DataTable.js';
export const Modules = () => h('section', {className: 'activity'}, h('h2', null, 'Runtime modules'), h(DataTable, {rows: modules}));
