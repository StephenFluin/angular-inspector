/**
 * Chrome's action API only accepts raster icons, so brand SVGs (written by scripts/generate-icons.mjs) are
 * drawn at the exact pixel sizes the toolbar needs. They're single-path icons, so Path2D is enough and this
 * works in the service worker, where SVG images can't be decoded.
 */

export interface SvgIcon {
    tile?: string;
    fill: string;
    translate: number;
    scale: number;
    d: string;
}

const attr = (tag: string | undefined, name: string) => tag?.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/** Parses the fixed shape our generated SVGs use: an optional background <rect> and a single <path>. */
export function parseSvgIcon(svg: string): SvgIcon | undefined {
    const path = svg.match(/<path\b[^>]*>/)?.[0];
    const d = attr(path, 'd');
    if (!d) return undefined;
    const transform = attr(path, 'transform') ?? '';
    return {
        tile: attr(svg.match(/<rect\b[^>]*>/)?.[0], 'fill'),
        fill: attr(path, 'fill') ?? '#000',
        translate: Number(transform.match(/translate\(([\d.]+)/)?.[1] ?? 0),
        scale: Number(transform.match(/scale\(([\d.]+)/)?.[1] ?? 1),
        d,
    };
}

export function rasterize(icon: SvgIcon, size: number): ImageData {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(size / 24, size / 24);
    if (icon.tile) {
        ctx.fillStyle = icon.tile;
        ctx.beginPath();
        ctx.roundRect(0, 0, 24, 24, 5);
        ctx.fill();
    }
    ctx.translate(icon.translate, icon.translate);
    ctx.scale(icon.scale, icon.scale);
    ctx.fillStyle = icon.fill;
    ctx.fill(new Path2D(icon.d));
    return ctx.getImageData(0, 0, size, size);
}

/** Toolbar icon sizes: 16px at 1x and 32px at 2x device pixel ratio. */
export async function loadToolbarIcon(url: string): Promise<Record<string, ImageData> | undefined> {
    const icon = parseSvgIcon(await (await fetch(url)).text());
    if (!icon) return undefined;
    return { 16: rasterize(icon, 16), 32: rasterize(icon, 32) };
}
