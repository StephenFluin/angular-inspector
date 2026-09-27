import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));

test('manifest version matches package.json (use `npm version <bump>` to change both)', () => {
    assert.equal(read('../src/manifest.json').version, read('../package.json').version);
});
