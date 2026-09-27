/**
 * Runs in the page's MAIN world (see manifest.json) so it can see page globals. Results are handed to the
 * ISOLATED world bridge (bridge.ts) through a DOM event, since MAIN world scripts can't use chrome.* APIs.
 */
import { detect } from './lib/detect.ts';
import { RESCAN_EVENT, RESULT_EVENT } from './lib/messages.ts';
import type { Detected } from './lib/tab-state.ts';

function report() {
    let apps: Detected = {};
    try {
        apps = detect();
    } catch (e) {
        console.debug('[Angular Inspector] detection failed', e);
    }
    document.dispatchEvent(new CustomEvent(RESULT_EVENT, { detail: JSON.stringify(apps) }));
}

report();
// Frameworks often bootstrap after the document is idle, so check again a couple of times.
setTimeout(report, 1500);
setTimeout(report, 5000);
document.addEventListener(RESCAN_EVENT, report);
