let detect = () => {
    let _apps = {};
    let doc = document.documentElement;
    let name;
    let r;

    // 1: detect by meta tags, the first matching group will be version
    let metas = doc.getElementsByTagName('meta');
    let meta_tests = {
        generator: {
            Joomla: /joomla!?\s*([\d\.]+)?/i,
            vBulletin: /vBulletin\s*(.*)/i,
            WordPress: /WordPress\s*(.*)/i,
            XOOPS: /xoops/i,
            Plone: /plone/i,
            MediaWiki: /MediaWiki/i,
            CMSMadeSimple: /CMS Made Simple/i,
            SilverStripe: /SilverStripe/i,
            'Movable Type': /Movable Type/i,
            'Amiro.CMS': /Amiro/i,
            Koobi: /koobi/i,
            bbPress: /bbPress/i,
            DokuWiki: /dokuWiki/i,
            TYPO3: /TYPO3/i,
            'PHP-Nuke': /PHP-Nuke/i,
            DotNetNuke: /DotNetNuke/i,
            Sitefinity: /Sitefinity\s+(.*)/i,
            WebGUI: /WebGUI/i,
            'ez Publish': /eZ\s*Publish/i,
            BIGACE: /BIGACE/i,
            TypePad: /typepad\.com/i,
            Blogger: /blogger/i,
            PrestaShop: /PrestaShop/i,
            SharePoint: /SharePoint/,
            JaliosJCMS: /Jalios JCMS/i,
            ZenCart: /zen-cart/i,
            WPML: /WPML/i,
            PivotX: /PivotX/i,
            OpenACS: /OpenACS/i,
            AlphaCMS: /alphacms\s+(.*)/i,
            concrete5: /concrete5 -\s*(.*)$/,
            Webnode: /Webnode/,
            GetSimple: /GetSimple/,
            DataLifeEngine: /DataLife Engine/,
            ClanSphere: /ClanSphere/,
            'Mura CMS': /Mura CMS\s*(.*)/i,
            'Tiki Wiki CMS Groupware': /Tiki/i,
        },
        copyright: {
            phpBB: /phpBB/i,
        },
        elggrelease: {
            Elgg: /.+/,
        },
        'powered-by': {
            Serendipity: /Serendipity/i,
        },
        author: {
            Avactis: /Avactis Team/i,
        },
    };

    for (let idx in metas) {
        let m = metas[idx];
        name = m.name ? m.name.toLowerCase() : '';

        if (!meta_tests[name]) continue;

        for (let t in meta_tests[name]) {
            if (t in _apps) continue;

            r = meta_tests[name][t].exec(m.content);
            if (r) {
                _apps[t] = r[1] ? r[1] : 'found';
            }
        }
    }

    // 2: detect by script tags
    let scripts = doc.getElementsByTagName('script');

    let script_tests = {
        'Google Analytics': /google-analytics.com\/(ga|urchin).js/i,
        Quantcast: /quantserve\.com\/quant\.js/i,
        Prototype: /prototype\.js/i,
        Joomla: /\/components\/com_/,
        Ubercart: /uc_cart/i,
        Closure: /\/goog\/base\.js/i,
        MODx: /\/min\/b=.*f=.*/,
        MooTools: /mootools/i,
        Dojo: /dojo(\.xd)?\.js/i,
        'script.aculo.us': /scriptaculous\.js/i,
        Disqus: /disqus.com/i,
        GetSatisfaction: /getsatisfaction\.com\/feedback/i,
        Wibiya: /wibiya\.com\/Loaders\//i,
        reCaptcha: /(google\.com\/recaptcha|api\.recaptcha\.net\/)/i,
        Mollom: /mollom\/mollom\.js/i, // only work on Drupal now
        ZenPhoto: /zp-core\/js/i,
        Gallery2: /main\.php\?.*g2_.*/i,
        AdSense: /pagead\/show_ads\.js/,
        XenForo: /js\/xenforo\//i,
        Cappuccino: /Frameworks\/Objective-J\/Objective-J\.js/,
        Avactis: /\/avactis-themes\//i,
        Volusion: /a\/j\/javascripts\.js/,
        AddThis: /addthis\.com\/js/,
        BuySellAds: /buysellads.com\/.*bsa\.js/,
        Weebly: /weebly\.com\/weebly\//,
        Bootstrap: /bootstrap-.*\.js/,
        Jigsy: /javascripts\/asterion\.js/, // may change later
        Yola: /analytics\.yola\.net/, // may change later
        Alfresco: /(alfresco)+(-min)?(\/scripts\/menu)?\.js/, // both Alfresco Share and Explorer apps
        'Mura CMS': /mura\/js/,
        'Tiki Wiki CMS Groupware': /tiki-js/,
        OpenTag: /opentag.*\.js/,
        KISSmetrics: /i.kissmetrics.com\/i.js/,
    };

    for (let idx in scripts) {
        let s = scripts[idx];
        if (!s.src) continue;
        let scriptSource = s.src;

        for (let t in script_tests) {
            if (t in _apps) continue;
            if (script_tests[t].test(scriptSource)) {
                _apps[t] = 'found';
            }
        }
    }

    // 3: detect by regexp
    let text = document.documentElement.outerHTML;
    let text_tests = {
        SMF: /<script .+\s+let smf_/i,
        Magento: /let BLANK_URL = '[^>]+js\/blank\.html'/i,
        Tumblr: /<iframe src=("|')http:\/\/\S+\.tumblr\.com/i,
        WordPress: /<link rel=("|')stylesheet("|') [^>]+wp-content/i,
        Closure: /<script[^>]*>.*goog\.require/i,
        Liferay: /<script[^>]*>.*LifeRay\.currentURL/i,
        vBulletin: /vbmenu_control/i,
        MODx: /(<a[^>]+>Powered by MODx<\/a>|let el= \$\('modxhost'\);|<script type=("|')text\/javascript("|')>let MODX_MEDIA_PATH = "media";)/i,
        miniBB: /<a href=("|')[^>]+minibb.+\s*<!--End of copyright link/i,
        'PHP-Fusion': /(href|src)=["']?infusions\//i, // @todo: recheck this pattern again
        OpenX: /(href|src)=["'].*delivery\/(afr|ajs|avw|ck)\.php[^"']*/,
        GetSatisfaction: /asset_host\s*\+\s*"javascripts\/feedback.*\.js/gim, // better recognization
        Fatwire: /\/Satellite\?|\/ContentServer\?/,
        Contao: /powered by (TYPOlight|Contao)/i,
        Moodle: /<link[^>]*\/theme\/standard\/styles.php".*>|<link[^>]*\/theme\/styles.php\?theme=.*".*>/,
        '1c-bitrix': /<link[^>]*\/bitrix\/.*?>/i,
        OpenCMS: /<link[^>]*\.opencms\..*?>/i,
        HumansTxt: /<link[^>]*rel=['"]?author['"]?/i,
        GoogleFontApi: /ref=["']?http:\/\/fonts.googleapis.com\//i,
        Prostores: /-legacycss\/Asset">/,
        osCommerce: /(product_info\.php\?products_id|_eof \/\/-->)/,
        OpenCart: /index.php\?route=product\/product/,
        Shibboleth: /<form action="\/idp\/Authn\/UserPassword" method="post">/,
        JsAction: /jsaction=("|')|jscontroller=("|')/,
    };

    for (let t in text_tests) {
        if (t in _apps) continue;
        if (text_tests[t].test(text)) {
            _apps[t] = 'found';
        }
    }

    // 4: detect by inline javascript
    let js_tests = {
        Drupal: function () {
            return window['Drupal'];
        },
        TomatoCMS: function () {
            return window['Tomato'];
        },
        MojoMotor: function () {
            return window['Mojo'];
        },
        ErainCart: function () {
            return window['fn_register_hooks'];
        },
        SugarCRM: function () {
            return window['SUGAR'];
        },
        YUI: function () {
            return window['YAHOO'] | window['YUI'];
        },
        jQuery: function () {
            return window['jQuery'];
        },
        'jQuery UI': function () {
            return window['jQuery'] && window['jQuery'].ui;
        },
        Typekit: function () {
            return window['Typekit'];
        },
        Facebook: function () {
            return window['FB'] && window['FB'].api;
        },
        ExtJS: function () {
            return window['Ext'];
        },
        Modernizr: function () {
            return window['Modernizr'];
        },
        Raphael: function () {
            return window['Raphael'];
        },
        Cufon: function () {
            return window['Cufon'];
        },
        sIFR: function () {
            return window['sIFR'];
        },
        Xiti: function () {
            return window['xtsite'] && window['xtpage'];
        },
        Piwik: function () {
            return window['Piwik'];
        },
        IPB: function () {
            return window['IPBoard'];
        },
        MyBB: function () {
            return window['MyBB'];
        },
        Clicky: function () {
            return window['clicky'];
        },
        Woopra: function () {
            return window['woopraTracker'];
        },
        RightJS: function () {
            return window['RightJS'];
        },
        OpenWebAnalytics: function () {
            return window['owa_baseUrl'];
        },
        Prettify: function () {
            return window['prettyPrint'];
        },
        SiteCatalyst: function () {
            return window['s_account'];
        },
        Twitter: function () {
            return window['twttr'];
        },
        Coremetrics: function () {
            return window['cmCreatePageviewTag'];
        },
        Buzz: function () {
            return window['google_buzz__base_url'];
        },
        GAPI: function () {
            return window['gapi'];
        },
        Plus1: function () {
            return window['gapi'] && window['gapi'].plusone;
        },
        'Google Loader': function () {
            return window['google'] && window['google'].load;
        },
        GoogleMapApi: function () {
            return window['google'] && window['google'].maps;
        },
        'Head JS': function () {
            return window['head'] && window['head'].js;
        },
        SWFObject: function () {
            return window['swfobject'];
        },
        Chitika: function () {
            return window['ch_client'] && window['ch_write_iframe'];
        },
        Jimdo: function () {
            return window['jimdoData'];
        },
        Webs: function () {
            return window['webs'];
        },
        'Backbone.js': function () {
            return window['Backbone'] && typeof window['Backbone'].sync === 'function';
        },
        'Underscore.js': function () {
            return window['_'] && typeof window['_'].identity === 'function' && window['_'].identity('abc') === 'abc';
        },
        Spine: function () {
            return window['Spine'];
        },
        AngularJS: function () {
            return window['angular'];
        },
        Angular: function () {
            return document.querySelector('[ng-version]');
        },
        Polymer: function () {
            return !!window['Polymer'];
        },
        React: function () {
            return !!document.querySelector('[data-reactroot], [data-reactid]');
        },
        Ning: function () {
            return window['ning'];
        },
        ektron: function () {
            return window['Ektron'];
        },
        etracker: function () {
            return window['et_params'];
        },
        http2: function () {
            return (<any>performance?.getEntriesByType('navigation')?.[0])?.nextHopProtocol === 'h2';
        },
        LiveStreet: function () {
            return window['LIVESTREET_SECURITY_KEY'];
        },
        OpenLayers: function () {
            return window['OpenLayers'];
        },
        Zepto: function () {
            return window['Zepto'];
        },
        Vue: () => {
            return window['Vue']?.version;
        },
    };

    for (let t in js_tests) {
        if (t in _apps) continue;
        if (js_tests[t]()) {
            _apps[t] = 'found';
        }
    }

    // 5: detect some script version when available
    let js_versions = {
        Prototype: function () {
            if (window['Prototype']?.Version !== undefined) return window['Prototype'].Version;
        },
        'script.aculo.us': function () {
            if (window['Scriptaculous']?.Version !== undefined) return window['Scriptaculous'].Version;
        },
        jQuery: function () {
            if (typeof window['jQuery'] === 'function' && window['jQuery'].prototype.jquery !== undefined)
                return window['jQuery'].prototype.jquery;
        },
        'jQuery UI': function () {
            return window['jQuery']?.ui?.version;
        },
        Dojo: function () {
            return window['dojo']?.version;
        },
        YUI: function () {
            if (typeof window['YAHOO'] === 'object' && window['YAHOO'].VERSION !== undefined)
                return window['YAHOO']?.VERSION;
            return window['YUI']?.()?.version;
        },
        MooTools: function () {
            return window['MooTools']?.version;
        },
        ExtJS: function () {
            return window['Ext']?.version;
        },
        RightJS: function () {
            return window['RightJS']?.version;
        },
        Modernizr: function () {
            return window['Modernizr']?._version;
        },
        Raphael: function () {
            return window['Raphael']?.version;
        },
        'Backbone.js': function () {
            if (window['Backbone'] && window['Backbone'].VERSION) return window['Backbone'].VERSION;
        },
        'Underscore.js': function () {
            if (window['_'] && window['_'].VERSION) return window['_'].VERSION;
        },
        Spine: function () {
            if (window['Spine'] && window['Spine'].version) return window['Spine'].version;
        },
        AngularJS: function () {
            if (window['angular'] && window['angular'].version && 'full' in window['angular'].version)
                return window['angular'].version.full;
        },
        Angular: function () {
            if (document.querySelector('[ng-version]')) {
                return document.querySelector('[ng-version]').attributes['ng-version'].value;
            }
        },
        Polymer: function () {
            return window['Polymer'].version;
        },
        OpenLayers: function () {
            if (window['OpenLayers'] && window['OpenLayers'].VERSION_NUMBER) return window['OpenLayers'].VERSION_NUMBER;
        },
    };

    for (let a in _apps) {
        if (_apps[a] === 'found' && js_versions[a]) {
            r = js_versions[a]();
            _apps[a] = r ? r : 'found';
        }
    }

    // @TODO detect by header, built-in database, defined css classes

    // Notify meta tag
    let meta = document.getElementById('angularinspector_meta');
    let readyEvent = new CustomEvent('ready', { detail: { apps: _apps, host: window.location.hostname } });

    meta.dispatchEvent(readyEvent);
};
detect();
// Angular sometimes takes a while to bootstrap, let's check again after 5 seconds
setTimeout(detect, 5000);
