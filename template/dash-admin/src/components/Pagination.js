import {h} from '/runtime/index.js';

export function Pagination({page, perPage, total, onChange}) {
  const currentPage = typeof page === 'function' ? page() : page;
  const pageSize = typeof perPage === 'function' ? perPage() : perPage;
  const count = typeof total === 'function' ? total() : total;
  const pages = Math.max(1, Math.ceil(count / pageSize));
  const start = count ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, count);
  return h('footer', {className: 'pagination'},
    h('span', null, `Showing ${start}–${end} of ${count}`),
    h('div', {className: 'pagination-actions'}, h('button', {className: 'button button-small', disabled: currentPage <= 1, onclick: () => onChange(currentPage - 1)}, 'Previous'), h('span', {className: 'page-number'}, `${currentPage} / ${pages}`), h('button', {className: 'button button-small', disabled: currentPage >= pages, onclick: () => onChange(currentPage + 1)}, 'Next')),
  );
}
