var tabinfo = {};

// initial list of header detection.  will move this to a separate file later.
var knownHeaders = {
  'x-powered-by': {
    // 'Ruby on Rails': /Phusion Passenger/,
    'Express.js': /Express/,
    'PHP': /PHP\/?(.*)/,
    'Dinkly': /DINKLY\/?(.*)/,
    'ASP.NET': /ASP\.NET/,
    'Nette': /Nette Framework/
  },
  'server': {
    'Apache': /Apache\/?(.*)/,
    'nginx': /nginx\/?(.*)/,
    'IIS': /Microsoft-IIS\/?(.*)/
  },
  'via': {
    'Varnish': /(.*) varnish/
  }
};

// Scans through the headers finding matches, and returning the val from appinfo (apps.js)
var headerDetector = function (headers) {
  var appsFound = [];

  // loop through all the headers received
  for (var i = headers.length - 1; i >= 0; i--) {
    var apps = knownHeaders[headers[i].name.toLowerCase()];
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
};

// collect apps from header information:
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    var appsFound = headerDetector(details.responseHeaders);
    tabinfo[details.tabId] = tabinfo[details.tabId] || {};
    tabinfo[details.tabId]['headers'] = appsFound;
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame']
  },
  ['responseHeaders']
);


chrome.tabs.onRemoved.addListener(function (tabId) {
  // free memory
  delete tabinfo[tabId];
});

function addScript(src) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", src);
  document.head.appendChild(script);
}



/**
 * Respond to results from the main.js content script, or to requests from popup.html 
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 'result' event issued by main.js once app identification is complete
  if (request.msg == 'result') {
    
    var thisTab = tabinfo[sender.tab.id];
    let host = request.host;

    // Sometimes we don't have headers, that's okay
    if(thisTab) {
      thisTab['apps'] = request.apps;
    } else {
      thisTab = {headers: [], apps: request.apps};
    }

    // Report on Angular, if the user wanted us to
    chrome.storage.sync.get({
      optin: false,
    }, function (items) {

      // Only send if the user is opted in, the site has Angular, and we haven't already sent data.
      if (items.optin && (request.apps.Angular || request.apps.AngularJS) && !sessionStorage[host] && host != "localhost") {
        data = {};
        
        sessionStorage[host] = true;

        let type = request.apps.Angular ? "angular" : "angularjs";
        let version = request.apps.Angular ? request.apps.Angular.replace(/\./g,"-") : request.apps.AngularJS.replace(/\./g,"-");

        data[version] = new Date().toISOString().substr(0,10);
        $.ajax(
          'https://angular-tracker.firebaseio.com/sites/' + host.replace(/\./g,"-") + '/' + type + '.json',
          {
            method: 'PATCH',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
          }
        );
      }
    });


    // load in any apps we discovered from headers:
    for (var header in thisTab['headers']) {
      thisTab['apps'][header] = thisTab['headers'][header];
    }

    // change the tab icon
    var mainApp = null;

    for (var app in request.apps) {
      if (mainApp === null) {
        mainApp = app;
        continue;
      }

      if (appinfo[app].priority) {
        if (!appinfo[mainApp].priority) {
          mainApp = app;
        }
        else if (appinfo[mainApp].priority > appinfo[app].priority) {
          mainApp = app;
        }
      }
    }

    var mainAppInfo = appinfo[mainApp];
    if (mainAppInfo) { // lazy bug
      var appTitle = mainAppInfo.title ? mainAppInfo.title : mainApp;

      if (request.apps[mainApp] != "-1") {
        appTitle = mainApp + ' ' + request.apps[mainApp];
      }

      try {
        chrome.pageAction.setIcon({ tabId: sender.tab.id, path: 'apps/' + mainAppInfo.icon });
        chrome.pageAction.setTitle({ tabId: sender.tab.id, title: appTitle });
      } catch(ex) {
        // Tab didn't exist anymore?
        console.error("Error updating pageaction icon",ex);
      }
    }

    try {
      chrome.pageAction.show(sender.tab.id);
    }catch(ex) {
      // The user probably re-used the tab.
    }
  } else if (request.msg == 'get') {
    // Request for 'get' comes from the popup page, asking for the list of apps
    var apps = tabinfo[request.tab];
    sendResponse(apps);
  }
});


