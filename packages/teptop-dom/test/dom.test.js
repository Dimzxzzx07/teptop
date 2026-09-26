import assert from 'node:assert/strict';
import test from 'node:test';
import {createDomAdapter, hydrateAttributes} from '../src/index.js';

test('dom adapter exposes view creation and attribute hydration', () => {
  const document = {querySelector: selector => ({selector})};
  const dom = createDomAdapter(document);
  assert.deepEqual(dom.createElement('p', null, 'hello'), {tag: 'p', props: {}, children: ['hello'], key: undefined});
  assert.deepEqual(dom.query('#app'), {selector: '#app'});
  const attributes = new Map();
  const element = {setAttribute: (key, value) => attributes.set(key, value), removeAttribute: key => attributes.delete(key)};
  hydrateAttributes(element, {role: 'main', hidden: false});
  assert.equal(attributes.get('role'), 'main');
  assert.equal(attributes.has('hidden'), false);
});
