import {createRouter, h} from '/teptop.js';
import {Navigation} from './components/Navigation.js';
import {ShellHeader} from './components/ShellHeader.js';
import {Overview} from './views/Overview.js';
import {Settings} from './views/Settings.js';

export const shell = ({navigate, path}) => h('div', {className: 'shell'}, h(ShellHeader), h(Navigation, {navigate, path}), path === '/' ? h(Overview) : h(Settings));

export function startPlayground(target = document.querySelector('#app')) {
  return createRouter({'/': shell, '/settings': shell, '*': shell}, target);
}

startPlayground();
