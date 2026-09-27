import type { Detected } from './tab-state.ts';

/** DOM events used between the MAIN world detector and the ISOLATED world bridge. */
export const RESULT_EVENT = 'angular-inspector:result';
export const RESCAN_EVENT = 'angular-inspector:rescan';

/** Bridge -> service worker. */
export interface ResultMessage {
    msg: 'result';
    /** URL the document was loaded from, used to match it with its response headers. */
    docUrl: string;
    apps: Detected;
}

/** Popup -> bridge: run detection again now. */
export interface RescanMessage {
    msg: 'rescan';
}

export const tabKey = (tabId: number) => `tab:${tabId}`;
