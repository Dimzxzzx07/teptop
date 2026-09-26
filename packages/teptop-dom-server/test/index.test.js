import assert from 'node:assert/strict';
import test from 'node:test';
import {createDomServer} from '../src/index.js';

test('dom server package exposes a working API', () => {
  const feature = createDomServer({enabled: true});
  assert.equal(feature.domain, 'dom');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});
