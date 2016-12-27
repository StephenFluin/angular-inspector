(function () {
  var head = document.getElementsByTagName('head')[0];

  if (head) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = chrome.extension.getURL('detector.js');

    var meta = document.createElement('meta');
    meta.name = 'angularinspector';
    meta.id = 'angularinspector_meta';
    head.appendChild(meta);
    head.appendChild(script);

    meta.addEventListener('ready', function () {
      var apps = JSON.parse(meta.content);

      if (Object.keys(apps).length > 0) {
        chrome.runtime.sendMessage({msg: "result", apps: apps});
      }
    });
  }
})();