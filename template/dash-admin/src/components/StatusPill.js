import {h} from '/runtime/index.js';

export function StatusPill({value}) {
  return h('span', {className: `status status-${String(value || 'unknown').toLowerCase()}`}, value || 'Unknown');
}
