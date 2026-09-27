/**
 * ISOLATED world content script. Relays detector results (detector.ts, MAIN world) to the service worker and
 * lets the popup ask for a fresh scan. Keep it small, it runs on every page.
 */
import { RESCAN_EVENT, RESULT_EVENT, type RescanMessage, type ResultMessage } from './lib/messages.ts';

/** The URL this document was loaded from, before any pushState navigation. */
function documentUrl() {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav?.name || location.href;
}

function send(apps: ResultMessage['apps']) {
    const message: ResultMessage = { msg: 'result', docUrl: documentUrl(), apps };
    try {
        chrome.runtime.sendMessage(message).catch(() => {});
    } catch {
        // The extension was reloaded or updated; this content script is orphaned.
    }
}

let pending: ResultMessage['apps'] | undefined;

document.addEventListener(RESULT_EVENT, (event) => {
    let apps: ResultMessage['apps'];
    try {
        apps = JSON.parse((event as CustomEvent<string>).detail);
    } catch {
        return;
    }
    // Prerendered pages aren't visible yet; report once the user actually navigates to them.
    if ((document as any).prerendering) {
        pending = { ...pending, ...apps };
    } else {
        send(apps);
    }
});

document.addEventListener('prerenderingchange', () => {
    if (pending) send(pending);
    pending = undefined;
});

// Pages restored from the back/forward cache don't re-run content scripts.
window.addEventListener('pageshow', (event) => {
    if (event.persisted) document.dispatchEvent(new CustomEvent(RESCAN_EVENT));
});

chrome.runtime.onMessage.addListener((message: RescanMessage, _sender, sendResponse) => {
    if (message?.msg !== 'rescan') return;
    document.dispatchEvent(new CustomEvent(RESCAN_EVENT));
    sendResponse({ ok: true });
});
