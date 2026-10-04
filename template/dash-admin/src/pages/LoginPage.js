import {h} from '/runtime/index.js';
import {authStatus} from '../state/admin.js';

export function LoginPage({onLogin}) {
  return h('main', {className: 'login-shell'},
    h('section', {className: 'login-aside'}, h('div', {className: 'brand'}, h('div', {className: 'brand-mark'}, 'F'), h('div', null, h('div', {className: 'brand-name'}, 'Fieldnote'), h('div', {className: 'brand-caption'}, 'Commerce workspace'))), h('div', null, h('div', {className: 'eyebrow'}, 'TEPTOP ADMIN TEMPLATE'), h('h1', null, 'Good operations start with a clear picture.'), h('p', null, 'A small, resource-first admin workspace built on Teptop signals and a local Node API.')), h('div', {className: 'login-aside-foot'}, 'LIGHTWEIGHT BY DESIGN · NO REACT · NO CLIENT SDK')),
    h('section', {className: 'login-form-wrap'}, h('form', {className: 'login-form', onsubmit: event => {event.preventDefault(); const form = event.currentTarget; onLogin(form.elements.username.value, form.elements.password.value);}},
      h('div', {className: 'eyebrow'}, 'ADMIN ACCESS'), h('h2', null, 'Sign in'), h('p', null, 'Use your workspace administrator credentials.'),
      h('div', {className: 'field'}, h('label', {for: 'username'}, 'Username'), h('input', {id: 'username', name: 'username', autocomplete: 'username', required: true, value: 'admin'})),
      h('div', {className: 'field'}, h('label', {for: 'password'}, 'Password'), h('input', {id: 'password', name: 'password', type: 'password', autocomplete: 'current-password', required: true})),
      h('div', {className: 'form-error', role: 'alert'}, () => authStatus().startsWith('error:') ? authStatus().slice(6) : ''),
      h('button', {className: 'button button-primary', type: 'submit', disabled: authStatus() === 'submitting'}, authStatus() === 'submitting' ? 'Signing in…' : 'Sign in'),
      h('div', {className: 'demo-hint'}, 'Development credentials are printed by the server on startup. Set DASH_ADMIN_USER and DASH_ADMIN_PASSWORD before deployment.'),
    )),
  );
}
