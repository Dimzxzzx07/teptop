import {h} from '/runtime/index.js';
import {resourceConfig} from '../config/resources.js';
import {StatusPill} from './StatusPill.js';

const currency = value => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(Number(value) || 0);
const date = value => value ? new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', year: 'numeric'}).format(new Date(`${value}T12:00:00`)) : '—';
const title = value => value.replace(/[A-Z]/g, letter => ` ${letter}`).replace(/^./, letter => letter.toUpperCase());

export function ResourceTable({resource, rows, loading, error, onEdit, onDelete, showActions = true}) {
  const config = resourceConfig[resource];
  if (loading) return h('div', {className: 'loading'}, 'Loading records…');
  if (error) return h('div', {className: 'error-note', role: 'alert'}, error);
  if (!rows.length) return h('div', {className: 'empty'}, 'No records match these filters.');
  return h('div', {className: 'table-wrap'}, h('table', {className: 'data-table'},
    h('thead', null, h('tr', null,
      ...config.columns.map(column => h('th', {key: column}, title(column))),
      showActions && h('th', {className: 'actions-head'}, 'Actions'),
    )),
    h('tbody', null, rows.map(row => h('tr', {key: row.id},
      ...config.columns.map(column => {
        const value = row[column];
        if (column === 'status') return h('td', {key: column}, h(StatusPill, {value}));
        if (['price', 'total'].includes(column)) return h('td', {key: column, className: 'mono'}, currency(value));
        if (['stock', 'items'].includes(column)) return h('td', {key: column, className: 'mono'}, String(value));
        if (['joinedAt', 'placedAt'].includes(column)) return h('td', {key: column}, date(value));
        if (column === config.primary) return h('td', {key: column}, h('span', {className: 'primary-cell'}, String(value)), config.secondary && h('span', {className: 'secondary-cell'}, String(row[config.secondary] || '')));
        return h('td', {key: column}, String(value ?? '—'));
      }),
      showActions && h('td', {className: 'table-actions'}, h('button', {className: 'button button-small', onclick: () => onEdit(row)}, 'Edit'), h('button', {className: 'button button-small button-danger', onclick: () => onDelete(row)}, 'Delete')),
    ))),
  ));
}
