/**
 * This file is included in every page, keep it small!
 */
(function () {
    const head = document.head;

    if (head) {
        const meta = document.createElement('meta');
        meta.name = 'angularinspector';
        meta.id = 'angularinspector_meta';
        head.appendChild(meta);
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('dist/detector.js');
        head.appendChild(script);

        meta.addEventListener('ready', (event) => {
            chrome.runtime.sendMessage({ msg: 'result', detail: event['detail'] });
        });
    }
})();
