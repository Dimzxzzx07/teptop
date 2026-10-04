import {h} from 'teptop.js';
export const SectionTitle = ({title, description}) => h('div', {className: 'section-title'}, h('h2', null, title), h('p', {className: 'muted'}, description));
