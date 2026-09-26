import assert from 'node:assert/strict';
import test from 'node:test';
import {createSecurityBrowser} from '../src/index.js';

test('security browser package exposes a working API', () => {
  const feature = createSecurityBrowser({enabled: true});
  assert.equal(feature.domain, 'security');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});
