import assert from 'node:assert/strict'; import test from 'node:test'; import {isSuccess} from './status.js'; test('success status classifier', () => assert.equal(isSuccess(204), true));
