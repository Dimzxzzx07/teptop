import {h} from '/teptop.js';
export const CommandButton = ({label, command}) => h('button', {className: 'command-button', onclick: command}, label);
