import assert from 'node:assert/strict'; import test from 'node:test'; import {message} from './messages.js'; test('worker message has type', () => assert.equal(message('ready').type, 'ready'));
