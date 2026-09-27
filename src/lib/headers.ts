import type { Detected } from './tab-state.ts';

/**
 * Response header rules: header name (lowercase) -> tool id -> pattern. When the pattern has a capture
 * group that matches, it is reported as the version.
 */
export const KnownHeaders: Record<string, Record<string, RegExp>> = {
    'x-powered-by': {
        'Express.js': /^Express$/,
        PHP: /PHP(?:\/([\d.]+))?/,
        'ASP.NET': /ASP\.NET/,
        'Next.js': /Next\.js(?: ([\d.]+))?/,
        Nuxt: /Nuxt/,
        Nette: /Nette Framework/,
        Dinkly: /DINKLY(?:\/([\d.]+))?/,
        'WP Engine': /WP Engine/,
        'Craft CMS': /Craft CMS/,
        'Phusion Passenger': /Phusion Passenger(?:\(R\))?(?: ([\d.]+))?/,
    },
    'x-aspnet-version': { 'ASP.NET': /([\d.]+)/ },
    server: {
        Apache: /^Apache(?:\/([\d.]+))?/,
        nginx: /^nginx(?:\/([\d.]+))?/,
        OpenResty: /^openresty(?:\/([\d.]+))?/,
        IIS: /^Microsoft-IIS(?:\/([\d.]+))?/,
        LiteSpeed: /LiteSpeed/i,
        Caddy: /^Caddy/,
        Envoy: /^envoy$/,
        Kestrel: /^Kestrel/,
        Gunicorn: /^gunicorn(?:\/([\d.]+))?/,
        Uvicorn: /^uvicorn$/,
        Puma: /^Puma/,
        Jetty: /Jetty(?:\(([\w.-]+)\))?/,
        Cowboy: /^Cowboy$/,
        Deno: /^deno(?:\/([\d.]+))?/,
        Cloudflare: /^cloudflare$/i,
        Vercel: /^Vercel$/i,
        Netlify: /^Netlify$/i,
        'GitHub Pages': /^GitHub\.com$/,
        'Amazon S3': /^AmazonS3$/,
        Akamai: /^Akamai/,
        'Google Cloud': /^Google Frontend$/,
        'Fly.io': /^Fly\//,
        Squarespace: /^Squarespace$/,
    },
    via: {
        Varnish: /varnish/i,
        'Amazon CloudFront': /CloudFront/,
        'Google Cloud': /\bgoogle\b/,
        Heroku: /vegur/,
    },
    'x-varnish': { Varnish: /./ },
    'cf-ray': { Cloudflare: /./ },
    'x-vercel-id': { Vercel: /./ },
    'x-nf-request-id': { Netlify: /./ },
    'x-amz-cf-id': { 'Amazon CloudFront': /./ },
    'x-fastly-request-id': { Fastly: /./ },
    'x-served-by': { Fastly: /^cache-/ },
    'x-akamai-transformed': { Akamai: /./ },
    'x-azure-ref': { 'Azure Front Door': /./ },
    'fly-request-id': { 'Fly.io': /./ },
    'x-render-origin-server': { Render: /./ },
    'x-github-request-id': { 'GitHub Pages': /./ },
    'x-shopid': { Shopify: /./ },
    'x-shopify-stage': { Shopify: /./ },
    'x-wix-request-id': { Wix: /./ },
    'x-drupal-cache': { Drupal: /./ },
    'x-drupal-dynamic-cache': { Drupal: /./ },
    'x-generator': { Drupal: /Drupal(?: (\d+))?/ },
    'x-nextjs-cache': { 'Next.js': /./ },
    'x-nextjs-prerender': { 'Next.js': /./ },
    'x-nextjs-stale-time': { 'Next.js': /./ },
};

export function detectFromHeaders(headers: { name: string; value?: string }[] = []): Detected {
    const found: Detected = {};
    for (const { name, value = '' } of headers) {
        const rules = KnownHeaders[name.toLowerCase()];
        if (!rules) continue;
        for (const [tool, pattern] of Object.entries(rules)) {
            const match = pattern.exec(value);
            if (match) found[tool] = match[1] || found[tool] || '';
        }
    }
    return found;
}
