import assert from 'node:assert/strict';
import test from 'node:test';
import {createSecurityServer} from '../src/index.js';

test('security server package exposes a working API', () => {
  const feature = createSecurityServer({enabled: true});
  assert.equal(feature.domain, 'security');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});
