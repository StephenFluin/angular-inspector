/**
 * Detection rules. Each JS test returns a version string, `true` when found without a version, or something
 * falsy. Used by detector.ts, which runs in the page's MAIN world.
 */
import type { Detected } from './tab-state.ts';

type Test = () => unknown;

const w = globalThis as any;

// 1: <meta> tags. The first capture group, if any, is the version.
export const metaTests: Record<string, Record<string, RegExp>> = {
    generator: {
        Joomla: /joomla!?\s*([\d.]+)?/i,
        vBulletin: /vBulletin\s*([\d.]+)?/i,
        WordPress: /WordPress\s*([\d.]+)?/i,
        Drupal: /Drupal\s*(\d+)?/i,
        XOOPS: /xoops/i,
        Plone: /plone/i,
        MediaWiki: /MediaWiki\s*([\d.]+)?/i,
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
        Sitefinity: /Sitefinity\s+([\d.]+)?/i,
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
        WooCommerce: /WooCommerce\s*([\d.]+)?/i,
        Astro: /Astro v?([\d.]+)?/,
        Gatsby: /Gatsby\s*([\d.]+)?/,
        'Next.js': /Next\.js/,
        Nuxt: /Nuxt/,
        Docusaurus: /Docusaurus v?([\d.]+)?/,
        VitePress: /VitePress v?([\d.]+)?/,
        Hugo: /Hugo\s*([\d.]+)?/,
        Jekyll: /Jekyll v?([\d.]+)?/,
        Eleventy: /Eleventy v?([\d.]+)?/,
        Hexo: /Hexo\s*([\d.]+)?/,
        MkDocs: /mkdocs-([\d.]+)/,
        Ghost: /Ghost\s*([\d.]+)?/,
        Wix: /Wix\.com/,
        Webflow: /Webflow/,
        Framer: /Framer\s*([\w.]+)?/,
        'HubSpot CMS': /HubSpot/,
        Discourse: /Discourse\s*([\d.]+)?/,
        Shopify: /Shopify/,
    },
    copyright: { phpBB: /phpBB/i },
    elggrelease: { Elgg: /.+/ },
    'powered-by': { Serendipity: /Serendipity/i },
    author: { Avactis: /Avactis Team/i },
};

// 2: <script src>
export const scriptTests: Record<string, RegExp> = {
    'Google Analytics': /google-analytics\.com\/(ga|urchin|analytics)\.js|googletagmanager\.com\/gtag\/js\?id=(G|UA)-/i,
    'Google Tag Manager': /googletagmanager\.com\/gtm\.js/i,
    'Google Publisher Tag': /securepubads\.g\.doubleclick\.net\/tag\/js\/gpt\.js/i,
    AdSense: /pagead\/show_ads\.js|pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/,
    Quantcast: /quantserve\.com\/quant\.js/i,
    Prototype: /prototype\.js/i,
    Joomla: /\/components\/com_/,
    Ubercart: /uc_cart/i,
    Closure: /\/goog\/base\.js/i,
    MODx: /\/min\/b=.*f=.*/,
    MooTools: /mootools/i,
    Dojo: /dojo(\.xd)?\.js/i,
    'script.aculo.us': /scriptaculous\.js/i,
    Disqus: /disqus\.com/i,
    GetSatisfaction: /getsatisfaction\.com\/feedback/i,
    Wibiya: /wibiya\.com\/Loaders\//i,
    reCaptcha: /(google\.com\/recaptcha|recaptcha\.net\/)/i,
    hCaptcha: /js\.hcaptcha\.com/i,
    'Cloudflare Turnstile': /challenges\.cloudflare\.com\/turnstile/i,
    Mollom: /mollom\/mollom\.js/i,
    ZenPhoto: /zp-core\/js/i,
    Gallery2: /main\.php\?.*g2_.*/i,
    XenForo: /js\/xenforo\//i,
    Cappuccino: /Frameworks\/Objective-J\/Objective-J\.js/,
    Avactis: /\/avactis-themes\//i,
    Volusion: /a\/j\/javascripts\.js/,
    AddThis: /addthis\.com\/js/,
    BuySellAds: /buysellads\.com\/.*bsa\.js/,
    Weebly: /weebly\.com\/weebly\//,
    Bootstrap: /bootstrap(\.bundle)?(\.min)?\.js/,
    Jigsy: /javascripts\/asterion\.js/,
    Yola: /analytics\.yola\.net/,
    Alfresco: /(alfresco)+(-min)?(\/scripts\/menu)?\.js/,
    'Mura CMS': /mura\/js/,
    'Tiki Wiki CMS Groupware': /tiki-js/,
    OpenTag: /opentag.*\.js/,
    KISSmetrics: /i\.kissmetrics\.(com|io)\/i\.js/,
    'Next.js': /\/_next\/static\//,
    Nuxt: /\/_nuxt\//,
    Vite: /\/@vite\/client/,
    Stripe: /js\.stripe\.com/,
    PayPal: /paypal\.com\/sdk\/js/,
    'Polyfill.io': /(^|\/\/)(cdn\.)?polyfill\.io\//,
    'Font Awesome': /fontawesome|font-awesome|kit\.fontawesome\.com/i,
    Typekit: /use\.typekit\.net/,
    'Microsoft Clarity': /clarity\.ms\/tag/,
    Plausible: /plausible\.io\/js/,
    Fathom: /cdn\.usefathom\.com/,
    'Vercel Analytics': /\/_vercel\/insights\/script\.js/,
    'Cloudflare Web Analytics': /static\.cloudflareinsights\.com\/beacon/,
    OneTrust: /cdn\.cookielaw\.org|optanon/i,
    Cookiebot: /consent\.cookiebot\.com/,
    Shopify: /cdn\.shopify\.com/,
    Wix: /static\.parastorage\.com/,
    Squarespace: /static1?\.squarespace\.com/,
    'HubSpot Tracking': /js\.hs-scripts\.com|js\.hs-analytics\.net/,
};

// 3: HTML source
export const textTests: Record<string, RegExp> = {
    SMF: /<script .+\s+var smf_/i,
    Magento: /var BLANK_URL = '[^>]+js\/blank\.html'|Magento_(Theme|Ui)\//i,
    Tumblr: /<iframe src=("|')https?:\/\/\S+\.tumblr\.com/i,
    WordPress: /<link rel=("|')stylesheet("|') [^>]+wp-content/i,
    Closure: /<script[^>]*>.*goog\.require/i,
    Liferay: /<script[^>]*>.*Liferay\.currentURL/i,
    vBulletin: /vbmenu_control/i,
    MODx: /(<a[^>]+>Powered by MODx<\/a>|var el= \$\('modxhost'\);|<script type=("|')text\/javascript("|')>var MODX_MEDIA_PATH = "media";)/i,
    miniBB: /<a href=("|')[^>]+minibb.+\s*<!--End of copyright link/i,
    'PHP-Fusion': /(href|src)=["']?infusions\//i,
    OpenX: /(href|src)=["'].*delivery\/(afr|ajs|avw|ck)\.php[^"']*/,
    GetSatisfaction: /asset_host\s*\+\s*"javascripts\/feedback.*\.js/im,
    Fatwire: /\/Satellite\?|\/ContentServer\?/,
    Contao: /powered by (TYPOlight|Contao)/i,
    Moodle: /<link[^>]*\/theme\/standard\/styles.php".*>|<link[^>]*\/theme\/styles.php\?theme=.*".*>/,
    '1c-bitrix': /<link[^>]*\/bitrix\/.*?>/i,
    OpenCMS: /<link[^>]*\.opencms\..*?>/i,
    HumansTxt: /<link[^>]*rel=['"]?author['"]?[^>]*humans\.txt/i,
    GoogleFontApi: /\/\/fonts\.(googleapis|gstatic)\.com\//i,
    Prostores: /-legacycss\/Asset">/,
    osCommerce: /(product_info\.php\?products_id|_eof \/\/-->)/,
    OpenCart: /index.php\?route=product\/product/,
    Shibboleth: /<form action="\/idp\/Authn\/UserPassword" method="post">/,
    JsAction: /jsaction=("|')|jscontroller=("|')/,
};

const $ = (selector: string) => document.querySelector(selector);

/** Top-level elements where frameworks usually mount; enough to find app roots without walking the whole DOM. */
function mountCandidates(): Element[] {
    const body = document.body;
    if (!body) return [];
    return [body, ...Array.from(body.children), ...Array.from(body.querySelectorAll(':scope > * > *')).slice(0, 200)];
}

function hasOwnKey(el: Element, test: (key: string) => boolean) {
    return Object.keys(el).some(test);
}

function reactRoot() {
    return mountCandidates().some((el) =>
        hasOwnKey(
            el,
            (k) => k.startsWith('__reactContainer$') || k.startsWith('__reactFiber$') || k === '_reactRootContainer'
        )
    );
}

function reactVersion(): string | undefined {
    const renderers: Map<unknown, { version?: string }> | undefined = w.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers;
    for (const renderer of renderers?.values?.() ?? []) {
        if (renderer?.version) return renderer.version;
    }
    return w.React?.version;
}

function vueVersion() {
    const vue3 = ($('[data-v-app]') as any)?.__vue_app__;
    if (vue3) return vue3.version || true;
    const vue2 = mountCandidates().find((el: any) => el.__vue__) as any;
    if (vue2) return vue2.__vue__.$root?.constructor?.version || w.Vue?.version || true;
    return w.Vue?.version;
}

function tailwind() {
    if (!document.body) return false;
    const style = getComputedStyle(document.body);
    return ['--tw-ring-offset-width', '--tw-border-spacing-x', '--tw-translate-x', '--tw-border-style'].some(
        (prop) => style.getPropertyValue(prop) !== ''
    );
}

function protocol(expected: string) {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    return nav?.nextHopProtocol === expected;
}

const lastOf = (list: unknown) => (Array.isArray(list) && list.length ? list[list.length - 1] : undefined);

// 4: page globals and DOM markers
export const jsTests: Record<string, Test> = {
    // Angular family
    Angular: () => $('[ng-version]')?.getAttribute('ng-version') || !!w.getAllAngularRootElements?.().length,
    'Angular SSR': () => $('[ng-server-context]')?.getAttribute('ng-server-context')?.toUpperCase(),
    'Angular Hydration': () => !!$('[ngh]'),
    'Angular Material': () => !!$('[class*="mat-mdc-"], .mat-app-background, .mat-typography'),
    Analog: () => !!(w.__analog || $('meta[name="generator"][content^="Analog"]')),
    'Zone.js': () => typeof w.Zone?.__symbol__ === 'function',
    AngularJS: () => w.angular?.version?.full || !!w.angular,

    // Frameworks
    React: () => reactVersion() || reactRoot() || !!$('[data-reactroot], [data-reactid]'),
    Preact: () => w.preact?.version || mountCandidates().some((el: any) => el.__k && typeof el.__k === 'object'),
    Vue: vueVersion,
    Svelte: () => (w.__svelte?.v?.size ? [...w.__svelte.v].join(', ') : !!$('[class*="svelte-"]')),
    Solid: () => !!(w.Solid$$ || w._$HY),
    SolidStart: () => !!w._$HY && !!$('script#solid-start'),
    Qwik: () => $('[q\\:container]')?.getAttribute('q:version') || !!$('[q\\:container]'),
    Lit: () => lastOf(w.litElementVersions) || lastOf(w.litHtmlVersions),
    Ember: () => w.Ember?.VERSION || !!$('.ember-view'),
    'Alpine.js': () => w.Alpine?.version || !!$('[x-data]'),
    htmx: () => w.htmx?.version || !!$('[hx-get], [hx-post], [data-hx-get], [data-hx-post]'),
    Stimulus: () => !!w.Stimulus || !!$('[data-controller][data-action]'),
    'Hotwire Turbo': () => !!w.Turbo || !!$('turbo-frame'),
    Livewire: () => !!w.Livewire || !!$('[wire\\:id]'),
    Inertia: () => !!$('#app[data-page]'),
    Flutter: () => !!(w._flutter || $('flt-glass-pane, flutter-view')),
    Blazor: () => !!w.Blazor,
    Elm: () => !!w.Elm,
    Polymer: () => w.Polymer?.version || !!w.Polymer,
    'Backbone.js': () => (typeof w.Backbone?.sync === 'function' ? w.Backbone.VERSION || true : false),
    Marionette: () => w.Marionette?.VERSION || !!w.Marionette,
    Knockout: () => w.ko?.version,
    Meteor: () => w.Meteor?.release || !!w.Meteor,
    Spine: () => w.Spine?.version || !!w.Spine,
    ExtJS: () => w.Ext?.version || w.Ext?.getVersion?.()?.version || !!w.Ext,
    YUI: () => w.YAHOO?.VERSION || w.YUI?.version || !!(w.YAHOO || w.YUI),
    Dojo: () => w.dojo?.version?.toString?.() || !!w.dojo,

    // Meta-frameworks
    'Next.js': () => w.next?.version || !!(w.__NEXT_DATA__ || w.__next_f || $('#__next')),
    Nuxt: () =>
        ($('#__nuxt') as any)?.__vue_app__?.$nuxt?.versions?.nuxt || !!(w.__NUXT__ || w.useNuxtApp || $('#__nuxt')),
    SvelteKit: () =>
        Object.keys(w).some((k) => k.startsWith('__sveltekit_')) ||
        !!$('[data-sveltekit-preload-data], [data-sveltekit-reload]'),
    Remix: () => !!w.__remixContext,
    'React Router': () => w.__reactRouterVersion || !!w.__reactRouterContext,
    Astro: () => !!$('astro-island, astro-slot'),
    Gatsby: () => !!(w.___gatsby || $('#___gatsby')),

    // Build tools
    webpack: () => Object.keys(w).some((k) => k.startsWith('webpackChunk')) || !!w.webpackJsonp,
    Turbopack: () => !!w.TURBOPACK,

    // Platforms
    Drupal: () => !!w.Drupal,
    TomatoCMS: () => !!w.Tomato,
    MojoMotor: () => !!w.Mojo,
    ErainCart: () => !!w.fn_register_hooks,
    SugarCRM: () => !!w.SUGAR,
    IPB: () => !!w.IPBoard,
    MyBB: () => !!w.MyBB,
    Jimdo: () => !!w.jimdoData,
    Webs: () => !!w.webs,
    Ning: () => !!w.ning,
    ektron: () => !!w.Ektron,
    LiveStreet: () => !!w.LIVESTREET_SECURITY_KEY,
    Shopify: () => !!w.Shopify?.shop,
    Wix: () => !!w.wixBiSession,
    Squarespace: () => !!w.Static?.SQUARESPACE_CONTEXT,
    Webflow: () => !!(w.Webflow || document.documentElement.hasAttribute('data-wf-page')),
    Framer: () => !!$('[data-framer-hydrate-v2], #__framer-badge-container'),
    BigCommerce: () => !!w.BCData,
    WooCommerce: () =>
        !!(w.wc_add_to_cart_params || w.woocommerce_params) || !!$('body.woocommerce, body.woocommerce-page'),
    Magento: () => !!(w.Mage || $('script[type="text/x-magento-init"]')),

    // Libraries
    jQuery: () => w.jQuery?.fn?.jquery || !!w.jQuery,
    'jQuery UI': () => w.jQuery?.ui?.version || !!w.jQuery?.ui,
    'jQuery Migrate': () => w.jQuery?.migrateVersion,
    Lodash: () => typeof w._?.runInContext === 'function' && (w._.VERSION || true),
    'Underscore.js': () =>
        typeof w._?.identity === 'function' &&
        typeof w._.runInContext !== 'function' &&
        w._.identity('abc') === 'abc' &&
        (w._.VERSION || true),
    D3: () => typeof w.d3?.select === 'function' && (w.d3.version || true),
    'Three.js': () => w.__THREE__ || w.THREE?.REVISION,
    'Babylon.js': () => w.BABYLON?.Engine?.Version || !!w.BABYLON,
    PixiJS: () => w.PIXI?.VERSION || (w.__PIXI_APP__ ? true : false),
    GSAP: () => w.gsap?.version || w.TweenMax?.version,
    Lottie: () => (w.lottie || w.bodymovin) && ((w.lottie || w.bodymovin).version || true),
    'Chart.js': () => typeof w.Chart === 'function' && w.Chart.version,
    Highcharts: () => w.Highcharts?.version,
    Leaflet: () => typeof w.L?.map === 'function' && w.L.version,
    'Mapbox GL JS': () => w.mapboxgl?.version,
    OpenLayers: () => w.OpenLayers?.VERSION_NUMBER || !!w.OpenLayers || w.ol?.VERSION,
    Moment: () => typeof w.moment === 'function' && (w.moment.version || true),
    'Day.js': () => typeof w.dayjs === 'function',
    Axios: () => typeof w.axios?.get === 'function' && (w.axios.VERSION || true),
    'Socket.IO': () => typeof w.io === 'function' && w.io.protocol !== undefined,
    Swiper: () => typeof w.Swiper === 'function' || !!$('.swiper-wrapper'),
    'core-js': () => w['__core-js_shared__']?.versions?.[0]?.version || !!w['__core-js_shared__'],
    Handlebars: () => w.Handlebars?.VERSION,
    Prototype: () => w.Prototype?.Version,
    'script.aculo.us': () => w.Scriptaculous?.Version,
    MooTools: () => w.MooTools?.version,
    RightJS: () => w.RightJS?.version || !!w.RightJS,
    Zepto: () => !!w.Zepto,
    Raphael: () => w.Raphael?.version || !!w.Raphael,
    Modernizr: () => w.Modernizr?._version || !!w.Modernizr,
    'Head JS': () => !!w.head?.js,
    'Google Loader': () => !!w.google?.load,
    SWFObject: () => !!w.swfobject,
    Prettify: () => !!w.prettyPrint,

    // UI & styling
    'Tailwind CSS': tailwind,
    Bootstrap: () => w.bootstrap?.Tooltip?.VERSION || w.jQuery?.fn?.tooltip?.Constructor?.VERSION,
    MUI: () => !!$('[class^="Mui"], [class*=" Mui"]'),
    'Chakra UI': () => !!$('[class*="chakra-"]'),
    Ionic: () => !!(w.Ionic || $('ion-app')),
    'Font Awesome': () => !!w.FontAwesome,
    Typekit: () => !!w.Typekit,
    Cufon: () => !!w.Cufon,
    sIFR: () => !!w.sIFR,

    // Analytics & monitoring
    'Google Analytics': () => !!(w.ga?.create || w.gaGlobal || w._gaq),
    'Google Tag Manager': () => Object.keys(w.google_tag_manager ?? {}).some((k) => k.startsWith('GTM-')),
    Segment: () => w.analytics?.VERSION && typeof w.analytics.track === 'function' && w.analytics.VERSION,
    Mixpanel: () => !!w.mixpanel?.__loaded || typeof w.mixpanel?.track === 'function',
    Amplitude: () => !!w.amplitude,
    PostHog: () => w.posthog?.version || !!w.posthog?.capture,
    Heap: () => !!w.heap?.appid || !!w.heapReadyCb,
    Hotjar: () => !!(w.hj && w._hjSettings),
    'Microsoft Clarity': () => typeof w.clarity === 'function',
    FullStory: () => !!(w._fs_namespace || w.FS?.getCurrentSessionURL),
    LogRocket: () => !!w.LogRocket,
    Plausible: () => typeof w.plausible === 'function',
    Fathom: () => typeof w.fathom?.trackPageview === 'function',
    Piwik: () => !!(w.Matomo || w.Piwik || w._paq),
    'Vercel Analytics': () => typeof w.va === 'function',
    'Cloudflare Web Analytics': () => !!w.__cfBeacon,
    'Adobe Experience Platform Launch': () => !!w._satellite,
    SiteCatalyst: () => !!(w.s_account || w.s_gi),
    Tealium: () => !!w.utag,
    Optimizely: () => !!w.optimizely,
    VWO: () => !!(w._vwo_code || w.VWO),
    Sentry: () => w.__SENTRY__?.version || w.Sentry?.SDK_VERSION || !!w.__SENTRY__,
    'Datadog RUM': () => w.DD_RUM?.version || !!w.DD_RUM,
    'New Relic': () => !!w.NREUM,
    Bugsnag: () => !!w.Bugsnag,
    'Meta Pixel': () => typeof w.fbq === 'function' && (w.fbq.version || true),
    'TikTok Pixel': () => !!w.ttq,
    'LinkedIn Insight Tag': () => !!(w._linkedin_partner_id || w.lintrk),
    'X Pixel': () => typeof w.twq === 'function',
    'Pinterest Tag': () => typeof w.pintrk === 'function',
    'HubSpot Tracking': () => !!w._hsq,
    'Yandex Metrica': () => typeof w.ym === 'function',
    Woopra: () => !!w.woopraTracker,
    OpenWebAnalytics: () => !!w.owa_baseUrl,
    Coremetrics: () => !!w.cmCreatePageviewTag,
    Xiti: () => !!(w.xtsite && w.xtpage),
    Clicky: () => !!w.clicky,
    etracker: () => !!w.et_params,

    // Widgets & services
    Stripe: () => typeof w.Stripe === 'function' && (w.Stripe.version || true),
    PayPal: () => w.paypal?.version || !!w.paypal?.Buttons,
    Firebase: () => w.firebase?.SDK_VERSION,
    Algolia: () => w.algoliasearch?.version || !!w.algoliasearch,
    Intercom: () => typeof w.Intercom === 'function',
    Zendesk: () => typeof w.zE === 'function',
    Drift: () => !!w.drift?.load,
    Crisp: () => !!w.$crisp,
    'Tawk.to': () => !!w.Tawk_API,
    OneTrust: () => !!w.OneTrust,
    Cookiebot: () => !!w.Cookiebot,
    reCaptcha: () => !!w.grecaptcha,
    hCaptcha: () => !!w.hcaptcha,
    'Cloudflare Turnstile': () => !!w.turnstile,
    GoogleMapApi: () => !!w.google?.maps,
    GAPI: () => !!w.gapi,
    Facebook: () => !!w.FB?.api,
    Twitter: () => !!w.twttr,
    Buzz: () => !!w.google_buzz__base_url,
    Plus1: () => !!w.gapi?.plusone,

    // Advertising
    'Google Publisher Tag': () => !!w.googletag?.apiReady,
    Chitika: () => !!(w.ch_client && w.ch_write_iframe),

    // Network
    'HTTP/2': () => protocol('h2'),
    'HTTP/3': () => protocol('h3'),
};

export function detect(): Detected {
    const apps: Detected = {};
    const found = (id: string, version: unknown) => {
        if (!version) return;
        const v = typeof version === 'string' || typeof version === 'number' ? String(version).trim() : '';
        if (!(id in apps) || (!apps[id] && v)) apps[id] = v.slice(0, 40);
    };

    for (const meta of Array.from(document.getElementsByTagName('meta'))) {
        const tests = metaTests[(meta.name || '').toLowerCase()];
        if (!tests) continue;
        for (const [id, pattern] of Object.entries(tests)) {
            const match = pattern.exec(meta.content);
            if (match) found(id, match[1] || true);
        }
    }

    for (const script of Array.from(document.scripts)) {
        if (!script.src) continue;
        for (const [id, pattern] of Object.entries(scriptTests)) {
            if (!(id in apps) && pattern.test(script.src)) found(id, true);
        }
    }

    const html = document.documentElement.outerHTML;
    for (const [id, pattern] of Object.entries(textTests)) {
        if (!(id in apps) && pattern.test(html)) found(id, true);
    }

    for (const [id, test] of Object.entries(jsTests)) {
        try {
            found(id, test());
        } catch {
            // A page can define globals with the same names as the libraries we look for.
        }
    }

    return apps;
}
