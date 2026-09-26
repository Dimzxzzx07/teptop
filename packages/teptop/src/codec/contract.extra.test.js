import assert from 'node:assert/strict'; import test from 'node:test'; import {byteLength} from './binary.js'; test('codec counts bytes', () => assert.equal(byteLength('x'), 1));
