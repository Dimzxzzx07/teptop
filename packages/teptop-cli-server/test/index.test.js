import assert from 'node:assert/strict';
import test from 'node:test';
import {createCliServer} from '../src/index.js';

test('cli server package exposes a working API', () => {
  const feature = createCliServer({enabled: true});
  assert.equal(feature.domain, 'cli');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});
