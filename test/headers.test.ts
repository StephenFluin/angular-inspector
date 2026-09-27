import assert from 'node:assert/strict';
import { test } from 'node:test';
import { detectFromHeaders } from '../src/lib/headers.ts';

test('detects servers with versions', () => {
    assert.deepEqual(
        detectFromHeaders([
            { name: 'Server', value: 'nginx/1.25.3' },
            { name: 'X-Powered-By', value: 'PHP/8.3.1' },
        ]),
        { nginx: '1.25.3', PHP: '8.3.1' }
    );
});

test('does not treat the rest of the header as a version', () => {
    assert.deepEqual(detectFromHeaders([{ name: 'server', value: 'Apache/2.4.57 (Debian)' }]), { Apache: '2.4.57' });
    assert.deepEqual(detectFromHeaders([{ name: 'server', value: 'Apache' }]), { Apache: '' });
});

test('detects hosting and CDNs from presence-only headers', () => {
    assert.deepEqual(
        detectFromHeaders([
            { name: 'cf-ray', value: '8a1b2c3d4e5f-SJC' },
            { name: 'server', value: 'cloudflare' },
            { name: 'x-vercel-id', value: 'sfo1::abc' },
            { name: 'x-nextjs-cache', value: 'HIT' },
        ]),
        { Cloudflare: '', Vercel: '', 'Next.js': '' }
    );
});

test('keeps a version found by another header', () => {
    assert.deepEqual(
        detectFromHeaders([
            { name: 'x-powered-by', value: 'ASP.NET' },
            { name: 'x-aspnet-version', value: '4.0.30319' },
        ]),
        { 'ASP.NET': '4.0.30319' }
    );
    assert.deepEqual(
        detectFromHeaders([
            { name: 'x-aspnet-version', value: '4.0.30319' },
            { name: 'x-powered-by', value: 'ASP.NET' },
        ]),
        { 'ASP.NET': '4.0.30319' }
    );
});

test('ignores unknown headers and missing values', () => {
    assert.deepEqual(detectFromHeaders([{ name: 'content-type', value: 'text/html' }, { name: 'server' }]), {});
    assert.deepEqual(detectFromHeaders(undefined), {});
});
