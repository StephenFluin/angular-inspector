class Background {
    /**
     * All of the collected results for all of the tabs
     */
    allCollectedTabResults: { [tab: number]: any } = {};

    constructor() {
        // collect apps from header information:
        chrome.webRequest.onHeadersReceived.addListener(
            details => {
                var appsFound = this.headerDetector(details.responseHeaders);
                this.allCollectedTabResults[details.tabId] = this.allCollectedTabResults[details.tabId] || {};
                this.allCollectedTabResults[details.tabId]['headers'] = appsFound;
            },
            {
                urls: ['<all_urls>'],
                types: ['main_frame'],
            },
            ['responseHeaders']
        );

        chrome.tabs.onRemoved.addListener(tabId => {
            console.log('Deleting data for tab',tabId);
            // free memory
            delete this.allCollectedTabResults[tabId];
        });

        /**
         * Respond to results from the main.js content script, or to requests from popup.html
         */
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('message received!', request, sender, sendResponse);
            if (request.msg == 'result') {
                console.log('results ready in bg!');
                return this.resultReceived(request, sender, sendResponse);
            } else if (request.msg == 'get') {
                console.log('received a request for data!');
                return this.getReceived(request, sender, sendResponse);
            } else {
                console.error('unkown message received in bg thread');
            }
        });
        console.log('background thread ready for messages!');
    }

    // Scans through the headers finding matches
    headerDetector(headers) {
        var appsFound = [];

        // loop through all the headers received
        for (var i = headers.length - 1; i >= 0; i--) {
            var apps = KnownHeaders[headers[i].name.toLowerCase()];
            if (!apps) {
                continue;
            }
            for (var app in apps) {
                var matches = headers[i].value.match(apps[app]);
                if (matches) {
                    var version = matches[1] || -1;
                    appsFound[app] = version;
                }
            }
        }

        return appsFound;
    }

    /**
     * Handle results from a tab
     */
    resultReceived(request, sender, sendResponse) {
        if (!this.allCollectedTabResults[sender.tab.id]) {
            this.allCollectedTabResults[sender.tab.id] = {};
        }
        let thisTab = this.allCollectedTabResults[sender.tab.id];
        let host = request.host;

        // Sometimes we don't have headers, that's okay
        if (thisTab) {
            console.log('apps come from request:',request.detail.apps);
            thisTab['apps'] = request.detail.apps;
        } else {
            thisTab['headers'] = [];
            thisTab['apps'] = request.detail.apps;
        }

        // Report on Angular, if the user wanted us to
        chrome.storage.sync.get(
            {
                optin: false,
            },
            function(items) {
                // Only send if the user is opted in, the site has Angular, and we haven't already sent data.
                if (
                    items.optin &&
                    (request.detail.apps.Angular || request.detail.apps.AngularJS) &&
                    !sessionStorage[host] &&
                    host != 'localhost'
                ) {
                    const data = {};

                    sessionStorage[host] = true;

                    let type = request.detail.apps.Angular ? 'angular' : 'angularjs';
                    let version = request.detail.apps.Angular
                        ? request.detail.apps.Angular.replace(/\./g, '-')
                        : request.detail.apps.AngularJS.replace(/\./g, '-');

                    data[version] = new Date().toISOString().substr(0, 10);
                    data['host'] = host;
                    $.ajax(
                        'https://angular-tracker.firebaseio.com/sites/' +
                            host.replace(/\./g, '-') +
                            '/' +
                            type +
                            '.json',
                        {
                            method: 'PATCH',
                            data: JSON.stringify(data),
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                        }
                    );
                }
            }
        );

        // load in any apps we discovered from headers:
        for (let header in thisTab['headers']) {
            thisTab['apps'][header] = thisTab['headers'][header];
        }

        // change the tab icon
        let mainApp = null;

        for (let app in request.detail.apps) {
            if (mainApp === null) {
                mainApp = app;
                continue;
            }

            if (ToolMetadata[app] && ToolMetadata[app].priority) {
                if (!ToolMetadata[mainApp].priority) {
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

            if (request.detail.apps[mainApp] != '-1') {
                appTitle = mainApp + ' ' + request.detail.apps[mainApp];
            }

            try {
                chrome.pageAction.setIcon({
                    tabId: sender.tab.id,
                    path: 'apps/' + mainAppInfo.icon,
                });
                chrome.pageAction.setTitle({ tabId: sender.tab.id, title: appTitle });
            } catch (ex) {
                // Tab didn't exist anymore?
                console.error('Error updating pageaction icon', ex);
            }
        }

        console.log('got to the end of processing results in background.');
        try {
            chrome.pageAction.show(sender.tab.id);
        } catch (ex) {
            // The user probably re-used the tab.
        }
    }

    /**
     *  Request for 'get' comes from the popup page, asking for the list of apps
     */
    getReceived(request, sender, sendResponse) {
        var apps = this.allCollectedTabResults[request.tab];
        console.log('sending response to popop for',request.tab,apps);
        console.log(this.allCollectedTabResults);
        sendResponse(apps);
    }
}
const bg = new Background();
