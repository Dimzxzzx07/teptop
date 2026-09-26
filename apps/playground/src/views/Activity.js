import {h} from '/teptop.js';
import {deployments} from '../data/deployments.js';
import {DataTable} from '../components/DataTable.js';
export const Activity = () => h('section', {className: 'activity'}, h('h2', null, 'Deployments'), h(DataTable, {rows: deployments}));
