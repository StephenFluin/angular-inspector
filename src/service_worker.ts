import { ToolMetadata, KnownHeaders } from './tool-metadata';

class Background {
    /**
     * All of the collected results for all of the tabs
     */
    allCollectedTabResults: { [tab: number]: any } = {};

    constructor() {
        // collect apps from header information:
        chrome.webRequest.onHeadersReceived.addListener(
            (details) => {
                var appsFound = this.headerDetector(details.responseHeaders);
                // Ensure the tab results exist
                this.allCollectedTabResults[details.tabId] = this.allCollectedTabResults[details.tabId] || {};
                this.allCollectedTabResults[details.tabId]['headers'] = appsFound;
            },
            {
                urls: ['<all_urls>'],
                types: ['main_frame'],
            },
            ['responseHeaders']
        );

        chrome.tabs.onRemoved.addListener((tabId) => {
            // free memory
            delete this.allCollectedTabResults[tabId];
        });

        /**
         * Respond to results from the main.js content script, or to requests from popup.html
         */
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.msg == 'result') {
                return this.resultReceived(request, sender, sendResponse);
            } else if (request.msg == 'get') {
                return this.getReceived(request, sender, sendResponse);
            } else {
                console.error('unknown message received in sw thread', request, sender);
            }
        });
    }

    // Scans through the headers finding matches
    headerDetector(headers) {
        const appsFound = [];

        // loop through all the headers received
        for (var i = headers.length - 1; i >= 0; i--) {
            var apps = KnownHeaders[headers[i].name.toLowerCase()];
            if (!apps) {
                continue;
            }
            for (var app in apps) {
                var matches = headers[i].value.match(apps[app]);
                if (matches) {
                    var version = matches[1] || 'found';
                    appsFound[app] = version;
                }
            }
        }

        return appsFound;
    }

    /**
     * Handle results from a tab
     */
    async resultReceived(request, sender, sendResponse) {
        if (!this.allCollectedTabResults[sender.tab.id]) {
            this.allCollectedTabResults[sender.tab.id] = {};
        }
        let thisTab = this.allCollectedTabResults[sender.tab.id];
        let host = request.detail.host;

        // Sometimes we don't have headers, that's okay
        if (thisTab) {
            thisTab['apps'] = request.detail.apps;
        } else {
            thisTab['headers'] = [];
            thisTab['apps'] = request.detail.apps;
        }

        this.reportIfAngularAndOptedIn(request, host);

        // load in any apps we discovered from headers:
        for (let header in thisTab['headers']) {
            thisTab['apps'][header] = thisTab['headers'][header];
        }

        // change the tab icon
        let mainApp = null;

        // Find the highest priority app to show on icon
        for (let app in request.detail.apps) {
            if (mainApp === null) {
                mainApp = app;
                continue;
            }

            if (ToolMetadata[app] && ToolMetadata[app].priority) {
                if (!ToolMetadata[mainApp] || !ToolMetadata[mainApp].priority) {
                    mainApp = app;
                } else if (ToolMetadata[mainApp].priority > ToolMetadata[app].priority) {
                    mainApp = app;
                }
            }
        }

        var mainAppInfo = ToolMetadata[mainApp];
        if (mainAppInfo) {
            // lazy bug
            var appTitle = mainAppInfo.title ? mainAppInfo.title : mainApp;

            if (request.detail.apps[mainApp] != 'found') {
                appTitle = mainApp + ' ' + request.detail.apps[mainApp];
            }

            try {
                chrome.action.setIcon({
                    tabId: sender.tab.id,
                    path: '/apps/' + mainAppInfo.icon,
                });
                chrome.action.setTitle({ tabId: sender.tab.id, title: appTitle });
            } catch (ex) {
                // Tab didn't exist anymore?
                console.error('Error updating pageaction icon', ex);
            }
        }

        try {
            chrome.pageAction.show(sender.tab.id);
        } catch (ex) {
            // The user probably re-used the tab.
        }
    }

    async reportIfAngularAndOptedIn(request, host) {
        // Report on Angular, if the user wanted us to
        const optin = (
            await chrome.storage.sync.get({
                optin: false,
            })
        )['optin'];
        // Only send if the user is opted in, the site has Angular, and we haven't already sent data.

        // Check storage.local to see if we've seen this host before.
        const hostValue = (await chrome.storage.local.get([host]))[host];

        if (
            !optin ||
            !(request.detail.apps.Angular || request.detail.apps.AngularJS) ||
            hostValue ||
            host == 'localhost'
        ) {
            // Do nothing, not appropriate
            return;
        }
        const data = {};

        const propertiesToSet = {};
        propertiesToSet[host] = true;
        chrome.storage.local.set(propertiesToSet);

        let type = request.detail.apps.Angular ? 'angular' : 'angularjs';
        let version = request.detail.apps.Angular
            ? request.detail.apps.Angular.replace(/\./g, '-')
            : request.detail.apps.AngularJS.replace(/\./g, '-');

        data[version] = new Date().toISOString().substring(0, 10);
        data['host'] = host;
        fetch('https://inspector-b2058.firebaseio.com/sites/' + host.replace(/\./g, '-') + '/' + type + '.json', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(data),
        });
    }

    /**
     *  Request for 'get' comes from the popup page, asking for the list of apps
     */
    getReceived(request, sender, sendResponse) {
        var apps = this.allCollectedTabResults[request.tab];
        sendResponse(apps);
    }
}
const bg = new Background();
