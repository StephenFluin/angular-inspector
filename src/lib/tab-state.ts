/** Detected tools: tool id -> version ('' when the version is unknown). */
export type Detected = Record<string, string>;

/** Everything we know about one tab. Kept in chrome.storage.session so it survives service worker restarts. */
export interface TabRecord {
    /** URL the current document was loaded from (without hash). */
    docUrl?: string;
    /** Tools reported by the content script for `docUrl`. */
    apps: Detected;
    /** Tools found in main-frame response headers, keyed by response URL (most recent last). */
    headers: Record<string, Detected>;
}

/** How many main-frame responses to remember per tab (redirects, bfcache, prerendering). */
const MAX_HEADER_ENTRIES = 5;

export function emptyRecord(): TabRecord {
    return { apps: {}, headers: {} };
}

export function normalizeUrl(url: string | undefined): string {
    if (!url) return '';
    const hash = url.indexOf('#');
    return hash === -1 ? url : url.slice(0, hash);
}

/** Adds `extra` into `base`, keeping versions we already know. */
export function mergeDetected(base: Detected, extra: Detected): Detected {
    const merged = { ...base };
    for (const [id, version] of Object.entries(extra)) {
        if (!(id in merged) || (!merged[id] && version)) merged[id] = version;
    }
    return merged;
}

export function recordHeaders(rec: TabRecord, url: string, found: Detected): TabRecord {
    const key = normalizeUrl(url);
    const headers = { ...rec.headers };
    delete headers[key];
    headers[key] = found;
    const keys = Object.keys(headers);
    for (const old of keys.slice(0, Math.max(0, keys.length - MAX_HEADER_ENTRIES))) delete headers[old];
    return { ...rec, headers };
}

/**
 * Records a content script report. Reports for a new document replace the previous document's results;
 * repeated reports for the same document (the detector runs several times) are merged.
 */
export function recordResult(rec: TabRecord, docUrl: string, apps: Detected): TabRecord {
    const key = normalizeUrl(docUrl);
    const previous = rec.docUrl === key ? rec.apps : {};
    return { ...rec, docUrl: key, apps: mergeDetected(previous, apps) };
}

/**
 * The combined view shown to the user: content script results plus the headers of the response that
 * produced the document. Falls back to headers for `tabUrl` when the content script never reported (e.g.
 * pages where extensions can't run scripts).
 */
export function viewFor(rec: TabRecord | undefined, tabUrl?: string): Detected {
    if (!rec) return {};
    const tabKey = normalizeUrl(tabUrl);
    if (rec.docUrl && (!tabKey || rec.docUrl === tabKey || !rec.headers[tabKey])) {
        return mergeDetected(rec.apps, rec.headers[rec.docUrl] ?? {});
    }
    return { ...(rec.headers[tabKey] ?? {}) };
}

/** The tool with the lowest priority value, used for the toolbar icon. */
export function pickPrimary(apps: Detected, priorityOf: (id: string) => number): string | undefined {
    let best: string | undefined;
    for (const id of Object.keys(apps)) {
        if (best === undefined || priorityOf(id) < priorityOf(best)) best = id;
    }
    return best;
}
