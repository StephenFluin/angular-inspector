import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { parseSvgIcon } from '../src/lib/svg-icon.ts';
import { getTool, ToolMetadata } from '../src/tool-metadata.ts';

test('Angular wins the toolbar icon over everything else', () => {
    const angular = ToolMetadata.Angular.priority;
    for (const tool of Object.values(ToolMetadata)) {
        if (tool.id !== 'Angular') assert.ok(tool.priority > angular, `${tool.id} outranks Angular`);
    }
});

test('unknown tools get a search link', () => {
    const tool = getTool('Some Tool');
    assert.equal(tool.title, 'Some Tool');
    assert.match(tool.url, /q=Some%20Tool$/);
});

test('every generated brand SVG parses for toolbar rendering', () => {
    for (const tool of Object.values(ToolMetadata)) {
        if (!tool.icon?.endsWith('.svg')) continue;
        const icon = parseSvgIcon(readFileSync(new URL(`../src/apps/${tool.icon}`, import.meta.url), 'utf8'));
        assert.ok(icon && icon.d.length > 10 && /^#[0-9a-f]{6}$/i.test(icon.fill), tool.id);
        assert.ok(icon.scale > 0 && icon.scale <= 1, tool.id);
    }
});
