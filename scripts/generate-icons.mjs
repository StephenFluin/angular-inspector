// Writes the Simple Icons (https://simpleicons.org, CC0) referenced by `brand` in src/tool-metadata.ts to
// src/apps/brands/<slug>.svg, in brand color. Run with `npm run icons` after adding a tool with a new `brand`.
//
// The files use a fixed shape that src/lib/svg-icon.ts parses to draw toolbar icons, since Chrome's action
// API only takes raster images: an optional background <rect> and one <path> with fill, transform and d.
import * as simpleIcons from 'simple-icons';
import { mkdirSync, writeFileSync } from 'node:fs';
import { ToolMetadata } from '../src/tool-metadata.ts';

const outDir = new URL('../src/apps/brands/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const bySlug = new Map(
    Object.values(simpleIcons)
        .filter((icon) => icon?.slug)
        .map((icon) => [icon.slug, icon])
);

/** Relative luminance of a hex color (0 = black, 1 = white). */
function luminance(hex) {
    const [r, g, b] = [0, 2, 4].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const slugs = [
    ...new Set(
        Object.values(ToolMetadata)
            .map((tool) => tool.brand)
            .filter(Boolean)
    ),
];
let failed = false;
for (const slug of slugs) {
    const icon = bySlug.get(slug);
    if (!icon) {
        console.error(`Unknown Simple Icons slug: ${slug}`);
        failed = true;
        continue;
    }
    // Very dark or very light brand colors disappear on one of Chrome's themes, so give them a tile.
    const lum = luminance(icon.hex);
    const tile = lum < 0.05 ? '#ffffff' : lum > 0.8 ? '#1f2023' : undefined;
    const inset = tile ? 4 : 0;
    const scale = (24 - inset * 2) / 24;
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>${escape(icon.title)}</title>` +
        (tile ? `<rect width="24" height="24" rx="5" fill="${tile}"/>` : '') +
        `<path fill="#${icon.hex}" transform="translate(${inset} ${inset}) scale(${scale})" d="${icon.path}"/></svg>\n`;
    writeFileSync(new URL(`${slug}.svg`, outDir), svg);
}
console.log(`Wrote ${slugs.length} brand icons to src/apps/brands/`);
if (failed) process.exit(1);
