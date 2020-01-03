/**
 * This file is included in every page, keep it small!
 */
console.log('main was loaded.');
(function() {
    const head = document.head;

    if (head) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = chrome.extension.getURL('dist/detector.js');

        var meta = document.createElement('meta');
        meta.name = 'angularinspector';
        meta.id = 'angularinspector_meta';
        head.appendChild(meta);
        head.appendChild(script);

        meta.addEventListener('ready', event => {
            console.log('ready event received!', event.detail);
            chrome.runtime.sendMessage({ msg: 'result', detail: event.detail });
        });
    }
})();
