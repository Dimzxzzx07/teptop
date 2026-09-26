import assert from 'node:assert/strict'; import test from 'node:test'; import {icons} from './index.js'; test('icon registry has overview', () => assert.equal(Boolean(icons.overview), true));
