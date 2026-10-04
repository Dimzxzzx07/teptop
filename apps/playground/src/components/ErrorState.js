import {h} from 'teptop.js';
export const ErrorState = ({message = 'Something went wrong', retry}) => h('div', {className: 'error-state'}, h('strong', null, message), retry && h('button', {onclick: retry}, 'Retry'));
