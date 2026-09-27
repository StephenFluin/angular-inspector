import assert from 'node:assert/strict';
import { test } from 'node:test';
import { emptyRecord, mergeDetected, pickPrimary, recordHeaders, recordResult, viewFor } from '../src/lib/tab-state.ts';

test('mergeDetected keeps known versions and fills in missing ones', () => {
    assert.deepEqual(mergeDetected({ Angular: '', jQuery: '3.7.1' }, { Angular: '18.2.0', jQuery: '', React: '' }), {
        Angular: '18.2.0',
        jQuery: '3.7.1',
        React: '',
    });
});

test('results for the same document merge, a new document replaces them', () => {
    let rec = recordResult(emptyRecord(), 'https://a.test/', { Angular: '' });
    rec = recordResult(rec, 'https://a.test/#top', { Angular: '19.0.0', 'Zone.js': '' });
    assert.deepEqual(rec.apps, { Angular: '19.0.0', 'Zone.js': '' });

    rec = recordResult(rec, 'https://b.test/', { React: '' });
    assert.deepEqual(rec.apps, { React: '' });
    assert.equal(rec.docUrl, 'https://b.test/');
});

test('the view combines content script results with the headers of the same document', () => {
    let rec = recordHeaders(emptyRecord(), 'https://a.test/', { nginx: '1.25' });
    rec = recordResult(rec, 'https://a.test/', { Angular: '19.0.0' });
    assert.deepEqual(viewFor(rec, 'https://a.test/'), { Angular: '19.0.0', nginx: '1.25' });
    // SPA navigation changes the tab URL without new headers.
    assert.deepEqual(viewFor(rec, 'https://a.test/settings'), { Angular: '19.0.0', nginx: '1.25' });
});

test('the view shows only headers for a page whose content script has not reported yet', () => {
    let rec = recordHeaders(emptyRecord(), 'https://a.test/', { nginx: '' });
    rec = recordResult(rec, 'https://a.test/', { Angular: '' });
    rec = recordHeaders(rec, 'https://b.test/', { Cloudflare: '' });
    assert.deepEqual(viewFor(rec, 'https://b.test/'), { Cloudflare: '' });
});

test('headers from a previous page are not attributed to a different document', () => {
    let rec = recordHeaders(emptyRecord(), 'https://a.test/', { nginx: '' });
    rec = recordResult(rec, 'https://b.test/', { React: '' });
    assert.deepEqual(viewFor(rec, 'https://b.test/'), { React: '' });
});

test('only the most recent header entries are kept', () => {
    let rec = emptyRecord();
    for (let i = 0; i < 8; i++) rec = recordHeaders(rec, `https://a.test/${i}`, {});
    assert.deepEqual(
        Object.keys(rec.headers),
        [3, 4, 5, 6, 7].map((i) => `https://a.test/${i}`)
    );
});

test('viewFor handles a missing record', () => {
    assert.deepEqual(viewFor(undefined, 'https://a.test/'), {});
});

test('pickPrimary picks the lowest priority', () => {
    const priorities: Record<string, number> = { Angular: 0.5, jQuery: 2 };
    assert.equal(
        pickPrimary({ jQuery: '', Angular: '' }, (id) => priorities[id] ?? 10),
        'Angular'
    );
    assert.equal(
        pickPrimary({}, () => 1),
        undefined
    );
});
