import {h} from '/runtime/index.js';
import {resourceConfig, statusOptions} from '../config/resources.js';
import {dataProvider} from '../data/provider.js';
import {dialogState, listState, loadList, notify} from '../state/admin.js';
import {Pagination} from '../components/Pagination.js';
import {RecordDialog} from '../components/RecordDialog.js';
import {ResourceTable} from '../components/ResourceTable.js';

export function ResourcePage({resource}) {
  const config = resourceConfig[resource];
  const statusFilter = () => listState().status;
  const query = () => listState().q;
  function edit(record = null) { dialogState.set({resource, record}); }
  async function remove(record) {
    if (!globalThis.confirm(`Delete ${config.singular.toLowerCase()} “${record[config.primary] || record.id}”? This cannot be undone.`)) return;
    try { await dataProvider.remove(resource, record.id); notify(`${config.singular} deleted.`); await loadList(resource); }
    catch (error) { notify(error.message, 'error'); }
  }
  async function save(values) {
    const dialog = dialogState.peek();
    try {
      if (dialog.record) await dataProvider.update(resource, dialog.record.id, values);
      else await dataProvider.create(resource, values);
      dialogState.set(null);
      notify(`${config.singular} ${dialog.record ? 'updated' : 'created'}.`);
      await loadList(resource);
    } catch (error) { notify(error.message, 'error'); }
  }
  return h('section', {className: 'page'},
    h('div', {className: 'page-heading'}, h('div', null, h('div', {className: 'eyebrow'}, 'RESOURCE / MANAGEMENT'), h('h1', null, config.label), h('p', null, `Manage ${config.label.toLowerCase()} and keep records in sync.`)), h('button', {className: 'button button-primary', onclick: () => edit()}, `+ New ${config.singular.toLowerCase()}`)),
    h('section', {className: 'panel'},
      h('div', {className: 'toolbar'},
        h('label', {className: 'sr-only', for: 'record-search'}, `Search ${config.label}`),
        h('input', {id: 'record-search', className: 'search', type: 'search', placeholder: `Search ${config.label.toLowerCase()}…`, value: query(), oninput: event => loadList(resource, {q: event.target.value, page: 1})}),
        h('label', {className: 'sr-only', for: 'status-filter'}, 'Filter by status'),
        h('select', {id: 'status-filter', className: 'select', value: statusFilter(), onchange: event => loadList(resource, {status: event.target.value, page: 1})}, h('option', {value: ''}, 'All statuses'), ...statusOptions[resource].map(status => h('option', {value: status, selected: statusFilter() === status, key: status}, status))),
        h('span', {className: 'toolbar-spacer'}), h('span', {className: 'panel-meta'}, () => `${listState().total} RECORDS`),
      ),
      () => {
        const state = listState();
        return h(ResourceTable, {resource, rows: state.data, loading: state.loading, error: state.error, onEdit: edit, onDelete: remove});
      },
      h(Pagination, {page: () => listState().page, perPage: () => listState().perPage, total: () => listState().total, onChange: page => loadList(resource, {page})}),
    ),
    () => {
      const dialog = dialogState();
      return dialog?.resource === resource ? h(RecordDialog, {resource, record: dialog.record, onClose: () => dialogState.set(null), onSave: save}) : null;
    },
  );
}
