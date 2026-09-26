import assert from 'node:assert/strict'; import test from 'node:test'; import {retryDelay} from './retry.js'; test('retry delay grows exponentially', () => assert.equal(retryDelay(2, 10), 40));
