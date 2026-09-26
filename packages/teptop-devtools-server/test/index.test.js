import assert from 'node:assert/strict';
import test from 'node:test';
import {createDevtoolsServer} from '../src/index.js';

test('devtools server package exposes a working API', () => {
  const feature = createDevtoolsServer({enabled: true});
  assert.equal(feature.domain, 'devtools');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});
