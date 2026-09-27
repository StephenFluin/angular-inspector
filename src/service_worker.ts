import { detectFromHeaders } from './lib/headers.ts';
import { tabKey, type ResultMessage } from './lib/messages.ts';
import { loadToolbarIcon } from './lib/svg-icon.ts';
import {
    emptyRecord,
    pickPrimary,
    recordHeaders,
    recordResult,
    viewFor,
    type Detected,
    type TabRecord,
} from './lib/tab-state.ts';
import { getTool } from './tool-metadata.ts';

/**
 * MV3 service workers are stopped whenever they're idle, so per-tab results live in chrome.storage.session
 * (which the popup reads directly). `records` is a write-through cache: every handler awaits `ready`, then
 * reads and mutates the cache synchronously, so concurrent events can't overwrite each other's updates.
 */
const records = new Map<number, TabRecord>();
const ready: Promise<void> = chrome.storage.session.get(null).then((stored) => {
    for (const [key, value] of Object.entries(stored)) {
        if (key.startsWith('tab:')) records.set(Number(key.slice(4)), value as TabRecord);
    }
});

async function update(tabId: number, change: (rec: TabRecord) => TabRecord): Promise<TabRecord> {
    await ready;
    const rec = change(records.get(tabId) ?? emptyRecord());
    records.set(tabId, rec);
    await chrome.storage.session.set({ [tabKey(tabId)]: rec });
    return rec;
}

// Listeners must be registered synchronously at startup so events can wake the worker.

chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (details.tabId < 0) return;
        const found = detectFromHeaders(details.responseHeaders);
        update(details.tabId, (rec) => recordHeaders(rec, details.url, found)).catch(console.error);
    },
    { urls: ['<all_urls>'], types: ['main_frame'] },
    ['responseHeaders']
);

chrome.tabs.onRemoved.addListener(async (tabId) => {
    await ready;
    records.delete(tabId);
    await chrome.storage.session.remove(tabKey(tabId));
});

chrome.runtime.onMessage.addListener((request: ResultMessage, sender) => {
    if (request?.msg !== 'result' || !sender.tab?.id || sender.id !== chrome.runtime.id) return;
    handleResult(sender.tab.id, sender.url ?? request.docUrl, request).catch(console.error);
});

async function handleResult(tabId: number, pageUrl: string, request: ResultMessage) {
    const apps = sanitize(request.apps);
    const rec = await update(tabId, (rec) => recordResult(rec, request.docUrl, apps));
    await updateAction(tabId, viewFor(rec));
    await reportIfAngularAndOptedIn(apps, pageUrl);
}

/** Results come from the page's MAIN world, so treat them as untrusted input. */
function sanitize(apps: unknown): Detected {
    const clean: Detected = {};
    if (!apps || typeof apps !== 'object') return clean;
    for (const [id, version] of Object.entries(apps).slice(0, 300)) {
        if (typeof version === 'string' && id.length <= 60) clean[id] = version.slice(0, 40);
    }
    return clean;
}

async function updateAction(tabId: number, apps: Detected) {
    const count = Object.keys(apps).length;
    const primary = pickPrimary(apps, (id) => getTool(id).priority);
    try {
        await chrome.action.setBadgeBackgroundColor({ tabId, color: '#5c6bc0' });
        await chrome.action.setBadgeText({ tabId, text: count ? String(count) : '' });
        if (!primary) return;
        const tool = getTool(primary);
        const version = apps[primary];
        await chrome.action.setTitle({
            tabId,
            title: `${tool.title}${version ? ' ' + version : ''} — ${count} detected`,
        });
        if (tool.icon?.endsWith('.svg')) {
            const imageData = await loadToolbarIcon('/apps/' + tool.icon);
            if (imageData) await chrome.action.setIcon({ tabId, imageData });
        } else if (tool.icon) {
            await chrome.action.setIcon({ tabId, path: '/apps/' + tool.icon });
        }
    } catch {
        // The tab was closed or navigated away while we were working.
    }
}

/** Optional, opt-in reporting of Angular usage. At most one report per host. */
async function reportIfAngularAndOptedIn(apps: Detected, pageUrl: string) {
    const type = 'Angular' in apps ? 'angular' : 'AngularJS' in apps ? 'angularjs' : undefined;
    const version = type === 'angular' ? apps.Angular : apps.AngularJS;
    let host: string;
    try {
        host = new URL(pageUrl).hostname;
    } catch {
        return;
    }
    if (!type || !version || !/^[\w.-]+$/.test(version) || !host || host === 'localhost' || /^[\d.:[\]]+$/.test(host)) {
        return;
    }

    const { optin } = await chrome.storage.sync.get({ optin: false });
    if (!optin) return;
    // Older versions stored the bare host name as the key.
    const reportedKey = 'reported:' + host;
    const reported = await chrome.storage.local.get([reportedKey, host]);
    if (reported[reportedKey] || reported[host]) return;
    await chrome.storage.local.set({ [reportedKey]: true });

    const data = { [version.replace(/\./g, '-')]: new Date().toISOString().substring(0, 10), host };
    await fetch(`https://inspector-b2058.firebaseio.com/sites/${host.replace(/\./g, '-')}/${type}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
    }).catch(() => {});
}
