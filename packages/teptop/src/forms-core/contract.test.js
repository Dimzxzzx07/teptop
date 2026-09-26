import assert from 'node:assert/strict'; import test from 'node:test'; import {field} from './fields.js'; test('form field stores its name', () => assert.equal(field('email').name, 'email'));
