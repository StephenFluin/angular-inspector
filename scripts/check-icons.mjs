// Verifies that every detectable tool has metadata and that every referenced icon file exists.
import { existsSync } from 'node:fs';
import { jsTests, metaTests, scriptTests, textTests } from '../src/lib/detect.ts';
import { KnownHeaders } from '../src/lib/headers.ts';
import { ToolMetadata } from '../src/tool-metadata.ts';

const detectable = new Set([
    ...Object.values(metaTests).flatMap(Object.keys),
    ...Object.keys(scriptTests),
    ...Object.keys(textTests),
    ...Object.keys(jsTests),
    ...Object.values(KnownHeaders).flatMap(Object.keys),
]);

const problems = [];
for (const id of detectable) {
    if (!ToolMetadata[id]) problems.push(`No metadata for detected tool "${id}"`);
}
for (const tool of Object.values(ToolMetadata)) {
    if (!detectable.has(tool.id)) problems.push(`"${tool.id}" has metadata but is never detected`);
    if (tool.icon && !existsSync(new URL(`../src/apps/${tool.icon}`, import.meta.url))) {
        problems.push(`Missing icon src/apps/${tool.icon} for "${tool.id}"${tool.brand ? ' (run npm run icons)' : ''}`);
    }
}

if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
}
console.log(`OK: ${detectable.size} detectable tools, all with metadata and icons.`);
