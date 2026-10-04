import assert from 'node:assert/strict';
import test from 'node:test';
import {Fragment, jsx, jsxs} from '../src/jsx-runtime.js';
import {jsxDEV} from '../src/jsx-dev-runtime.js';
import {toHTML} from '../src/server.js';

test('automatic JSX runtime maps elements and fragments to Teptop views', () => {
  const view = jsxs(Fragment, {children: [jsx('h1', {children: 'Signal view'}), jsx('p', {className: 'note', children: 'No React runtime'})]});
  assert.equal(view.tag, Fragment);
  assert.equal(view.children.length, 2);
  assert.equal(toHTML(view), '<!--teptop:fragment:start--><h1>Signal view</h1><p class="note">No React runtime</p><!--teptop:fragment:end-->');
  assert.equal(jsxDEV('span', {children: 'dev'}, undefined, false, null, null).tag, 'span');
});
