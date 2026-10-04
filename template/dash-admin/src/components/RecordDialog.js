import {h} from '/runtime/index.js';
import {fieldConfig, resourceConfig, statusOptions} from '../config/resources.js';

export function RecordDialog({resource, record, onClose, onSave}) {
  const config = resourceConfig[resource];
  const editing = Boolean(record);
  const fields = config.fields.map(name => {
    const field = fieldConfig[name];
    const value = record?.[name] ?? '';
    const control = field.type === 'select'
      ? h('select', {id: `field-${name}`, name, required: Boolean(field.required)}, h('option', {value: ''}, 'Select status'), ...(statusOptions[resource] || []).map(option => h('option', {value: option, selected: value === option, key: option}, option)))
      : h('input', {id: `field-${name}`, name, type: field.type, value, required: Boolean(field.required), min: field.min, step: field.type === 'number' ? 'any' : undefined});
    return h('div', {className: 'field', key: name}, h('label', {for: `field-${name}`}, field.label), control);
  });
  return h('div', {className: 'overlay', onclick: event => {if (event.target === event.currentTarget) onClose();}},
    h('section', {className: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dialog-title'},
      h('div', {className: 'dialog-head'}, h('div', null, h('h2', {id: 'dialog-title'}, `${editing ? 'Edit' : 'New'} ${config.singular.toLowerCase()}`), h('p', null, `${editing ? 'Update' : 'Add'} a ${config.singular.toLowerCase()} record.`), h('button', {className: 'dialog-close', onclick: onClose, 'aria-label': 'Close dialog'}, '×'))),
      h('form', {onsubmit: event => {event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form).entries()); onSave(values);}},
        h('div', {className: 'dialog-grid'}, ...fields),
        h('div', {className: 'dialog-actions'}, h('button', {type: 'button', className: 'button', onclick: onClose}, 'Cancel'), h('button', {type: 'submit', className: 'button button-primary'}, editing ? 'Save changes' : `Create ${config.singular.toLowerCase()}`)),
      ),
    ),
  );
}
