import assert from 'node:assert/strict'; import test from 'node:test'; import {darkTheme} from './dark.js'; test('dark theme has a surface', () => assert.equal(Boolean(darkTheme.surface), true));
