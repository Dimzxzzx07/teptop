import assert from 'node:assert/strict'; import test from 'node:test'; import {isSettled} from './status.js'; test('resource status recognizes ready', () => assert.equal(isSettled('ready'), true));
