/**
 * Display information for every tool the extension can detect. Keys are the tool ids emitted by the
 * detector (detector.ts) and the header rules (lib/headers.ts).
 *
 * - `icon` is a file under src/apps/. When omitted and `brand` is set, the icon is the SVG generated from
 *   the Simple Icons slug `brand` by `npm run icons` (src/apps/brands/<brand>.svg).
 * - `priority` decides which tool is shown as the toolbar icon (lowest wins). Defaults to the category's.
 */

export type Category =
    | 'Frameworks'
    | 'Meta-frameworks & SSR'
    | 'CMS & platforms'
    | 'JavaScript libraries'
    | 'UI & styling'
    | 'Build tools'
    | 'Analytics & monitoring'
    | 'Widgets & services'
    | 'Advertising'
    | 'Server-side'
    | 'Hosting & CDN'
    | 'Network';

export interface ToolInfo {
    title?: string;
    icon?: string;
    brand?: string;
    url: string;
    priority?: number;
}

export interface Tool extends ToolInfo {
    id: string;
    title: string;
    category: Category;
    priority: number;
}

/** Display order of categories in the popup, and the default toolbar priority of their tools. */
export const Categories: { name: Category; priority: number }[] = [
    { name: 'Frameworks', priority: 1 },
    { name: 'Meta-frameworks & SSR', priority: 0.9 },
    { name: 'CMS & platforms', priority: 1.2 },
    { name: 'JavaScript libraries', priority: 2 },
    { name: 'UI & styling', priority: 3 },
    { name: 'Build tools', priority: 3.5 },
    { name: 'Server-side', priority: 3.5 },
    { name: 'Analytics & monitoring', priority: 4 },
    { name: 'Widgets & services', priority: 4 },
    { name: 'Hosting & CDN', priority: 4.5 },
    { name: 'Advertising', priority: 5 },
    { name: 'Network', priority: 6 },
];

const Frameworks: Record<string, ToolInfo> = {
    Angular: { icon: 'angular.png', url: 'https://angular.dev/', priority: 0.5 },
    AngularJS: { icon: 'AngularJS.png', url: 'https://angularjs.org/', priority: 0.6 },
    React: { icon: 'react.png', url: 'https://react.dev/' },
    Vue: { title: 'Vue.js', brand: 'vuedotjs', url: 'https://vuejs.org/' },
    Svelte: { brand: 'svelte', url: 'https://svelte.dev/' },
    Solid: { title: 'SolidJS', brand: 'solid', url: 'https://www.solidjs.com/' },
    Preact: { brand: 'preact', url: 'https://preactjs.com/' },
    Qwik: { brand: 'qwik', url: 'https://qwik.dev/' },
    Lit: { brand: 'lit', url: 'https://lit.dev/' },
    Ember: { title: 'Ember.js', icon: 'ember.png', url: 'https://emberjs.com/' },
    'Alpine.js': { brand: 'alpinedotjs', url: 'https://alpinejs.dev/' },
    htmx: { brand: 'htmx', url: 'https://htmx.org/' },
    Stimulus: { brand: 'stimulus', url: 'https://stimulus.hotwired.dev/' },
    'Hotwire Turbo': { brand: 'hotwire', url: 'https://turbo.hotwired.dev/' },
    Livewire: { brand: 'livewire', url: 'https://livewire.laravel.com/' },
    Inertia: { title: 'Inertia.js', brand: 'inertia', url: 'https://inertiajs.com/' },
    Flutter: { title: 'Flutter Web', brand: 'flutter', url: 'https://flutter.dev/' },
    Blazor: { brand: 'blazor', url: 'https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor' },
    Elm: { brand: 'elm', url: 'https://elm-lang.org/' },
    Polymer: { icon: 'polymer.png', url: 'https://polymer-library.polymer-project.org/', priority: 1.4 },
    'Backbone.js': { icon: 'Backbone.png', url: 'https://backbonejs.org/', priority: 1.9 },
    Marionette: { title: 'Marionette.js', icon: 'marionette.png', url: 'https://marionettejs.com/', priority: 1.8 },
    Knockout: { title: 'Knockout.js', url: 'https://knockoutjs.com/' },
    Meteor: { icon: 'meteor-0.png', url: 'https://www.meteor.com/' },
    Spine: { icon: 'spine.png', url: 'https://spine.github.io/', priority: 1.9 },
    Cappuccino: { icon: 'cappuccino.png', url: 'https://www.cappuccino.dev/', priority: 2 },
    ExtJS: { title: 'Ext JS', icon: 'ExtJS.png', url: 'https://www.sencha.com/products/extjs/', priority: 2 },
    Closure: {
        title: 'Closure Library',
        icon: 'Closure.png',
        url: 'https://github.com/google/closure-library',
        priority: 2,
    },
    YUI: { icon: 'YUI.png', url: 'https://yuilibrary.com/', priority: 2 },
    Dojo: { icon: 'dojo-0.png', url: 'https://dojotoolkit.org/', priority: 2 },
    JsAction: { title: 'JSAction', icon: 'google.png', url: 'https://github.com/google/jsaction', priority: 2 },
};

const MetaFrameworks: Record<string, ToolInfo> = {
    'Angular SSR': { title: 'Angular SSR', icon: 'angular.png', url: 'https://angular.dev/guide/ssr', priority: 0.55 },
    'Angular Hydration': { icon: 'angular.png', url: 'https://angular.dev/guide/hydration', priority: 0.55 },
    Analog: { url: 'https://analogjs.org/' },
    'Next.js': { brand: 'nextdotjs', url: 'https://nextjs.org/' },
    Nuxt: { brand: 'nuxt', url: 'https://nuxt.com/' },
    SvelteKit: { brand: 'svelte', url: 'https://svelte.dev/docs/kit' },
    Remix: { brand: 'remix', url: 'https://remix.run/' },
    'React Router': { brand: 'reactrouter', url: 'https://reactrouter.com/' },
    Astro: { brand: 'astro', url: 'https://astro.build/' },
    Gatsby: { brand: 'gatsby', url: 'https://www.gatsbyjs.com/' },
    SolidStart: { brand: 'solid', url: 'https://start.solidjs.com/' },
    Docusaurus: { brand: 'docusaurus', url: 'https://docusaurus.io/' },
    VitePress: { brand: 'vitepress', url: 'https://vitepress.dev/' },
    Hugo: { brand: 'hugo', url: 'https://gohugo.io/' },
    Jekyll: { brand: 'jekyll', url: 'https://jekyllrb.com/' },
    Eleventy: { brand: 'eleventy', url: 'https://www.11ty.dev/' },
    Hexo: { brand: 'hexo', url: 'https://hexo.io/' },
    MkDocs: { brand: 'materialformkdocs', url: 'https://www.mkdocs.org/' },
};

const Platforms: Record<string, ToolInfo> = {
    WordPress: { icon: 'WordPress.png', url: 'https://wordpress.org/' },
    WooCommerce: { brand: 'woocommerce', url: 'https://woocommerce.com/', priority: 1.1 },
    Shopify: { brand: 'shopify', url: 'https://www.shopify.com/' },
    Wix: { brand: 'wix', url: 'https://www.wix.com/' },
    Squarespace: { icon: 'squarespace.png', url: 'https://www.squarespace.com/' },
    Webflow: { brand: 'webflow', url: 'https://webflow.com/' },
    Framer: { brand: 'framer', url: 'https://www.framer.com/' },
    Ghost: { brand: 'ghost', url: 'https://ghost.org/' },
    Drupal: { icon: 'Drupal-0.png', url: 'https://www.drupal.org/' },
    Joomla: { icon: 'Joomla.png', url: 'https://www.joomla.org/' },
    Magento: { icon: 'Magento.png', url: 'https://business.adobe.com/products/magento/magento-commerce.html' },
    BigCommerce: { brand: 'bigcommerce', url: 'https://www.bigcommerce.com/' },
    'HubSpot CMS': { icon: 'hubspot.png', url: 'https://www.hubspot.com/products/cms' },
    Discourse: { brand: 'discourse', url: 'https://www.discourse.org/' },
    Tumblr: { icon: 'Tumblr.png', url: 'https://www.tumblr.com/', priority: 0.9 },
    TypePad: { icon: 'TypePad-0.png', url: 'https://www.typepad.com/', priority: 0.9 },
    Blogger: { icon: 'Blogger-0.png', url: 'https://www.blogger.com/', priority: 0.9 },
    Webs: { icon: 'webs.png', url: 'https://www.webs.com/', priority: 0.9 },
    Weebly: { icon: 'weebly.png', url: 'https://www.weebly.com/', priority: 0.9 },
    Webnode: { icon: 'webnode-0.png', url: 'https://www.webnode.com/', priority: 0.9 },
    Jimdo: { icon: 'jimdo.png', url: 'https://www.jimdo.com/', priority: 0.9 },
    Jigsy: { icon: 'jigsy.png', url: 'https://www.jigsy.com/', priority: 0.9 },
    Yola: { icon: 'yola.png', url: 'https://www.yola.com/', priority: 0.9 },
    vBulletin: { icon: 'vBulletin-0.png', url: 'https://www.vbulletin.com/' },
    SMF: { title: 'Simple Machines Forum', icon: 'SMF.png', url: 'https://www.simplemachines.org/' },
    phpBB: { icon: 'phpBB.png', url: 'https://www.phpbb.com/' },
    IPB: { title: 'Invision Community', icon: 'IPB.png', url: 'https://invisioncommunity.com/' },
    miniBB: { icon: 'miniBB.png', url: 'https://www.minibb.com/' },
    MyBB: { icon: 'mybb-0.png', url: 'https://mybb.com/' },
    XenForo: { icon: 'xenforo.png', url: 'https://xenforo.com/' },
    Ubercart: { icon: 'Ubercart.png', url: 'https://www.drupal.org/project/ubercart', priority: 0.9 },
    AlphaCMS: { icon: 'alphacms.png', url: 'http://www.mego.com.vn/' },
    TomatoCMS: { icon: 'tomatocms.png', url: 'http://www.tomatocms.com/' },
    WPML: { icon: 'WPML.png', url: 'https://wpml.org/', priority: 1.3 },
    bbPress: { icon: 'bbPress.png', url: 'https://bbpress.org/' },
    'Movable Type': { icon: 'MovableType.png', url: 'https://www.movabletype.org/' },
    Serendipity: { icon: 'Serendipity.png', url: 'https://docs.s9y.org/' },
    concrete5: { title: 'Concrete CMS', icon: 'concrete5.gif', url: 'https://www.concretecms.com/' },
    MediaWiki: { icon: 'MediaWiki.png', url: 'https://www.mediawiki.org/' },
    DokuWiki: { icon: 'DokuWiki-0.png', url: 'https://www.dokuwiki.org/' },
    OpenACS: { icon: 'openacs.png', url: 'https://openacs.org/' },
    XOOPS: { icon: 'XOOPS.png', url: 'https://xoops.org/' },
    Plone: { icon: 'Plone-0.png', url: 'https://plone.org/' },
    CMSMadeSimple: { title: 'CMS Made Simple', icon: 'CMSMadeSimple.png', url: 'https://www.cmsmadesimple.org/' },
    SilverStripe: { title: 'Silverstripe CMS', icon: 'SilverStripe.png', url: 'https://www.silverstripe.org/' },
    MODx: { title: 'MODX', icon: 'MODx.png', url: 'https://modx.com/' },
    'Amiro.CMS': { icon: 'Amiro.CMS.png', url: 'https://www.amirocms.com/' },
    JaliosJCMS: { title: 'Jalios JCMS', icon: 'JaliosJCMS.png', url: 'https://www.jalios.com/' },
    Koobi: { icon: 'Koobi-0.png', url: 'http://www.dream4.de/cms/' },
    Liferay: { icon: 'LifeRay.png', url: 'https://www.liferay.com/' },
    TYPO3: { icon: 'TYPO3.png', url: 'https://typo3.org/' },
    Contao: { icon: 'contao.png', url: 'https://contao.org/' },
    Fatwire: { icon: 'Fatwire.png', url: 'https://www.oracle.com/webcenter/' },
    'PHP-Fusion': { icon: 'PHP-Fusion-0.png', url: 'https://phpfusion.com/' },
    'PHP-Nuke': { icon: 'PHP-Nuke.png', url: 'https://phpnuke.org/' },
    WebGUI: { icon: 'WebGUI.png', url: 'https://github.com/plainblack/webgui' },
    'ez Publish': { title: 'eZ Publish', icon: 'eZ.png', url: 'https://ez.no/' },
    BIGACE: { icon: 'BIGACE.png', url: 'https://www.bigace.de/' },
    OpenCMS: { title: 'OpenCms', icon: 'opencms.png', url: 'https://www.opencms.org/' },
    '1c-bitrix': { title: '1C-Bitrix', icon: '1c-bitrix.png', url: 'https://www.1c-bitrix.ru/' },
    MojoMotor: { icon: 'mojomotor.png', url: 'https://github.com/EllisLab/MojoMotor' },
    GetSimple: { title: 'GetSimple CMS', icon: 'getsimple.png', url: 'https://get-simple.info/' },
    DataLifeEngine: { title: 'DataLife Engine', icon: 'datalife-0.png', url: 'https://dle-news.ru/' },
    Elgg: { icon: 'Elgg.png', url: 'https://elgg.org/' },
    DotNetNuke: { title: 'DNN', icon: 'DotNetNuke-0.png', url: 'https://www.dnnsoftware.com/' },
    Sitefinity: { icon: 'Sitefinity-0.png', url: 'https://www.progress.com/sitefinity-cms' },
    SharePoint: {
        title: 'Microsoft SharePoint',
        icon: 'SharePoint.png',
        url: 'https://www.microsoft.com/microsoft-365/sharepoint',
    },
    ZenPhoto: { icon: 'ZenPhoto.png', url: 'https://www.zenphoto.org/' },
    Gallery2: { icon: 'Gallery2.png', url: 'http://galleryproject.org/' },
    Avactis: { icon: 'avactis.png', url: 'http://www.avactis.com/' },
    PrestaShop: { icon: 'PrestaShop.png', url: 'https://www.prestashop.com/' },
    Prostores: { icon: 'prostores.png', url: 'http://www.prostores.com/' },
    ZenCart: { title: 'Zen Cart', icon: 'zencart.png', url: 'https://www.zen-cart.com/' },
    ErainCart: { icon: 'eraincart.png', url: 'http://eraincart.com/' },
    Volusion: { icon: 'volusion.png', url: 'https://www.volusion.com/' },
    osCommerce: { icon: 'osCommerce.png', url: 'https://www.oscommerce.com/' },
    OpenCart: { icon: 'opencart.png', url: 'https://www.opencart.com/' },
    Moodle: { icon: 'moodle.png', url: 'https://moodle.org/' },
    SugarCRM: { icon: 'sugarcrm.png', url: 'https://www.sugarcrm.com/' },
    PivotX: { icon: 'pivotx.png', url: 'https://pivotx.net/' },
    Shibboleth: { icon: 'shibboleth.png', url: 'https://www.shibboleth.net/' },
    Alfresco: { icon: 'Alfresco.png', url: 'https://www.hyland.com/en/products/alfresco-platform' },
    ClanSphere: { icon: 'ClanSphere.png', url: 'https://www.csphere.eu/' },
    Ning: { icon: 'ning.png', url: 'https://www.ning.com/' },
    ektron: { title: 'Ektron', icon: 'ektron.png', url: 'https://www.optimizely.com/' },
    'Mura CMS': { icon: 'muracms.png', url: 'https://www.getmura.com/' },
    'Tiki Wiki CMS Groupware': { icon: 'TikiWikiCms.png', url: 'https://tiki.org/' },
    LiveStreet: { title: 'LiveStreet CMS', icon: 'LiveStreetCms.png', url: 'https://livestreetcms.com/' },
};

const Libraries: Record<string, ToolInfo> = {
    jQuery: { icon: 'jQuery.png', url: 'https://jquery.com/' },
    'jQuery UI': { icon: 'jquery_ui.png', url: 'https://jqueryui.com/', priority: 1.9 },
    'jQuery Migrate': { icon: 'jQuery.png', url: 'https://github.com/jquery/jquery-migrate' },
    'Zone.js': {
        icon: 'angular.png',
        url: 'https://github.com/angular/angular/tree/main/packages/zone.js',
        priority: 2.5,
    },
    Lodash: { brand: 'lodash', url: 'https://lodash.com/' },
    'Underscore.js': { icon: 'Underscore.png', url: 'https://underscorejs.org/', priority: 2.9 },
    D3: { brand: 'd3', url: 'https://d3js.org/' },
    'Three.js': { brand: 'threedotjs', url: 'https://threejs.org/' },
    'Babylon.js': { brand: 'babylondotjs', url: 'https://www.babylonjs.com/' },
    PixiJS: { url: 'https://pixijs.com/' },
    GSAP: { brand: 'greensock', url: 'https://gsap.com/' },
    Lottie: { brand: 'lottiefiles', url: 'https://airbnb.io/lottie/' },
    'Chart.js': { brand: 'chartdotjs', url: 'https://www.chartjs.org/' },
    Highcharts: { url: 'https://www.highcharts.com/' },
    Leaflet: { brand: 'leaflet', url: 'https://leafletjs.com/' },
    'Mapbox GL JS': { brand: 'mapbox', url: 'https://docs.mapbox.com/mapbox-gl-js/' },
    OpenLayers: { icon: 'OpenLayers.png', url: 'https://openlayers.org/', priority: 1.9 },
    Moment: { title: 'Moment.js', url: 'https://momentjs.com/' },
    'Day.js': { url: 'https://day.js.org/' },
    Axios: { brand: 'axios', url: 'https://axios-http.com/' },
    'Socket.IO': { brand: 'socketdotio', url: 'https://socket.io/' },
    Swiper: { brand: 'swiper', url: 'https://swiperjs.com/' },
    'core-js': { url: 'https://github.com/zloirock/core-js' },
    'Polyfill.io': {
        title: 'Polyfill.io (compromised CDN)',
        url: 'https://sansec.io/research/polyfill-supply-chain-attack',
    },
    Handlebars: { icon: 'handlebars.png', url: 'https://handlebarsjs.com/' },
    Prototype: { icon: 'Prototype.png', url: 'http://prototypejs.org/' },
    MooTools: { icon: 'MooTools.png', url: 'https://mootools.net/' },
    'script.aculo.us': { icon: 'script.aculo.us.png', url: 'http://script.aculo.us/', priority: 1.9 },
    RightJS: { icon: 'rightjs.png', url: 'https://github.com/rightjs/rightjs-core' },
    Zepto: { title: 'Zepto.js', icon: 'zepto.png', url: 'https://zeptojs.com/', priority: 1.5 },
    Raphael: { icon: 'raphael.png', url: 'https://dmitrybaranovskiy.github.io/raphael/' },
    Modernizr: { icon: 'modernizr.png', url: 'https://modernizr.com/' },
    'Head JS': { icon: 'headjs.gif', url: 'https://github.com/headjs/headjs' },
    'Google Loader': { icon: 'google.png', url: 'https://developers.google.com/loader' },
    SWFObject: { icon: 'SWFObject.png', url: 'https://github.com/swfobject/swfobject' },
    Prettify: {
        title: 'Google Code Prettify',
        icon: 'google.png',
        url: 'https://github.com/googlearchive/code-prettify',
    },
};

const Ui: Record<string, ToolInfo> = {
    'Angular Material': { icon: 'angular.png', url: 'https://material.angular.dev/', priority: 2.5 },
    'Tailwind CSS': { brand: 'tailwindcss', url: 'https://tailwindcss.com/' },
    Bootstrap: { icon: 'bootstrap.png', url: 'https://getbootstrap.com/' },
    MUI: { title: 'Material UI', brand: 'mui', url: 'https://mui.com/' },
    'Chakra UI': { brand: 'chakraui', url: 'https://chakra-ui.com/' },
    Ionic: { brand: 'ionic', url: 'https://ionicframework.com/' },
    'Font Awesome': { brand: 'fontawesome', url: 'https://fontawesome.com/' },
    GoogleFontApi: { title: 'Google Fonts', icon: 'google-font-api.gif', url: 'https://fonts.google.com/' },
    Typekit: { title: 'Adobe Fonts (Typekit)', icon: 'typekit.png', url: 'https://fonts.adobe.com/' },
    Cufon: { icon: 'cufon.png', url: 'https://github.com/sorccu/cufon' },
    sIFR: { icon: 'sifr.gif', url: 'https://github.com/Mark-H/sIFR' },
};

const BuildTools: Record<string, ToolInfo> = {
    Vite: { title: 'Vite (dev server)', brand: 'vite', url: 'https://vite.dev/' },
    webpack: { brand: 'webpack', url: 'https://webpack.js.org/' },
    Turbopack: { url: 'https://nextjs.org/docs/app/api-reference/turbopack' },
};

const Analytics: Record<string, ToolInfo> = {
    'Google Analytics': { icon: 'Google_Analytics.png', url: 'https://marketingplatform.google.com/about/analytics/' },
    'Google Tag Manager': { brand: 'googletagmanager', url: 'https://tagmanager.google.com/' },
    Segment: { url: 'https://segment.com/' },
    Mixpanel: { brand: 'mixpanel', url: 'https://mixpanel.com/' },
    Amplitude: { url: 'https://amplitude.com/' },
    PostHog: { brand: 'posthog', url: 'https://posthog.com/' },
    Heap: { url: 'https://www.heap.io/' },
    Hotjar: { brand: 'hotjar', url: 'https://www.hotjar.com/' },
    'Microsoft Clarity': { url: 'https://clarity.microsoft.com/' },
    FullStory: { url: 'https://www.fullstory.com/' },
    LogRocket: { url: 'https://logrocket.com/' },
    Plausible: { brand: 'plausibleanalytics', url: 'https://plausible.io/' },
    Fathom: { url: 'https://usefathom.com/' },
    Piwik: { title: 'Matomo (Piwik)', brand: 'matomo', url: 'https://matomo.org/' },
    'Vercel Analytics': { brand: 'vercel', url: 'https://vercel.com/analytics' },
    'Cloudflare Web Analytics': { brand: 'cloudflare', url: 'https://www.cloudflare.com/web-analytics/' },
    'Adobe Experience Platform Launch': {
        url: 'https://experienceleague.adobe.com/docs/experience-platform/tags/home.html',
    },
    SiteCatalyst: {
        title: 'Adobe Analytics',
        icon: 'SiteCatalyst.png',
        url: 'https://business.adobe.com/products/analytics/adobe-analytics.html',
    },
    Tealium: { url: 'https://tealium.com/' },
    Optimizely: { url: 'https://www.optimizely.com/' },
    VWO: { url: 'https://vwo.com/' },
    Sentry: { brand: 'sentry', url: 'https://sentry.io/' },
    'Datadog RUM': { brand: 'datadog', url: 'https://www.datadoghq.com/product/real-user-monitoring/' },
    'New Relic': { icon: 'newrelic.png', url: 'https://newrelic.com/' },
    Bugsnag: { url: 'https://www.bugsnag.com/' },
    'Meta Pixel': { brand: 'meta', url: 'https://www.facebook.com/business/tools/meta-pixel' },
    'TikTok Pixel': { brand: 'tiktok', url: 'https://ads.tiktok.com/help/article/tiktok-pixel' },
    'LinkedIn Insight Tag': { url: 'https://business.linkedin.com/marketing-solutions/insight-tag' },
    'X Pixel': {
        brand: 'x',
        url: 'https://business.x.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites',
    },
    'Pinterest Tag': {
        brand: 'pinterest',
        url: 'https://help.pinterest.com/business/article/track-conversions-with-pinterest-tag',
    },
    'HubSpot Tracking': { icon: 'hubspot.png', url: 'https://www.hubspot.com/' },
    'Yandex Metrica': { url: 'https://metrica.yandex.com/' },
    Woopra: { icon: 'woopra.png', url: 'https://www.woopra.com/' },
    OpenWebAnalytics: { title: 'Open Web Analytics', icon: 'owa.png', url: 'https://www.openwebanalytics.com/' },
    Coremetrics: { icon: 'coremetrics.png', url: 'https://www.acoustic.com/' },
    Quantcast: { icon: 'Quantcast.png', url: 'https://www.quantcast.com/' },
    Xiti: { title: 'Xiti Tracker', icon: 'xiti.png', url: 'https://www.atinternet.com/' },
    Clicky: { icon: 'clicky.png', url: 'https://clicky.com/' },
    KISSmetrics: { icon: 'kissmetrics-0.png', url: 'https://www.kissmetrics.io/', priority: 3.9 },
    etracker: { icon: 'etracker.png', url: 'https://www.etracker.com/' },
    OpenTag: { icon: 'OpenTag.png', url: 'https://www.qubit.com/' },
};

const Widgets: Record<string, ToolInfo> = {
    Stripe: { brand: 'stripe', url: 'https://stripe.com/' },
    PayPal: { brand: 'paypal', url: 'https://developer.paypal.com/' },
    Firebase: { brand: 'firebase', url: 'https://firebase.google.com/' },
    Algolia: { brand: 'algolia', url: 'https://www.algolia.com/' },
    Intercom: { brand: 'intercom', url: 'https://www.intercom.com/' },
    Zendesk: { brand: 'zendesk', url: 'https://www.zendesk.com/' },
    Drift: { url: 'https://www.salesloft.com/platform/drift' },
    Crisp: { url: 'https://crisp.chat/' },
    'Tawk.to': { url: 'https://www.tawk.to/' },
    OneTrust: { url: 'https://www.onetrust.com/' },
    Cookiebot: { url: 'https://www.cookiebot.com/' },
    reCaptcha: { title: 'reCAPTCHA', icon: 'reCaptcha.png', url: 'https://developers.google.com/recaptcha' },
    hCaptcha: { url: 'https://www.hcaptcha.com/' },
    'Cloudflare Turnstile': { brand: 'cloudflare', url: 'https://www.cloudflare.com/products/turnstile/' },
    GoogleMapApi: { title: 'Google Maps API', icon: 'gmap.png', url: 'https://developers.google.com/maps' },
    GAPI: {
        title: 'Google API Client',
        icon: 'google.png',
        url: 'https://github.com/google/google-api-javascript-client',
    },
    Facebook: { title: 'Facebook SDK', icon: 'facebook.png', url: 'https://developers.facebook.com/' },
    Twitter: { title: 'X (Twitter) widgets', icon: 'twitter.png', url: 'https://developer.x.com/' },
    Disqus: { icon: 'Disqus.png', url: 'https://disqus.com/' },
    AddThis: { icon: 'addthis.png', url: 'https://www.addthis.com/' },
    GetSatisfaction: { title: 'Get Satisfaction', icon: 'GetSatisfaction.gif', url: 'https://getsatisfaction.com/' },
    Wibiya: { icon: 'Wibiya.png', url: 'http://wibiya.com/' },
    Mollom: { icon: 'mollom.png', url: 'https://www.drupal.org/project/mollom' },
    Buzz: { title: 'Google Buzz Button', icon: 'buzz.png', url: 'https://en.wikipedia.org/wiki/Google_Buzz' },
    Plus1: { title: 'Google +1 Button', icon: 'plus1.png', url: 'https://en.wikipedia.org/wiki/Google%2B' },
    HumansTxt: { title: 'humans.txt', icon: 'humanstxt.png', url: 'https://humanstxt.org/' },
};

const Advertising: Record<string, ToolInfo> = {
    AdSense: { icon: 'AdSense.gif', url: 'https://adsense.google.com/' },
    'Google Publisher Tag': { icon: 'google.png', url: 'https://developers.google.com/publisher-tag' },
    OpenX: { icon: 'OpenX.png', url: 'https://www.openx.com/' },
    Chitika: { icon: 'chitika.png', url: 'https://chitika.com/' },
    BuySellAds: { icon: 'buysellads.png', url: 'https://www.buysellads.com/' },
};

const ServerSide: Record<string, ToolInfo> = {
    'Express.js': { icon: 'expressjs.png', url: 'https://expressjs.com/', priority: 3 },
    PHP: { icon: 'php.png', url: 'https://www.php.net/' },
    'ASP.NET': { icon: 'asp.net.png', url: 'https://dotnet.microsoft.com/apps/aspnet' },
    Kestrel: { brand: 'dotnet', url: 'https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel' },
    Nette: { title: 'Nette Framework', icon: 'nette.png', url: 'https://nette.org/' },
    Dinkly: { icon: 'dinkly.png', url: 'https://github.com/lewsid/dinkly/' },
    'Craft CMS': { brand: 'craftcms', url: 'https://craftcms.com/' },
    Deno: { brand: 'deno', url: 'https://deno.com/' },
    Gunicorn: { brand: 'gunicorn', url: 'https://gunicorn.org/' },
    Uvicorn: { url: 'https://www.uvicorn.org/' },
    Puma: { url: 'https://puma.io/' },
    'Phusion Passenger': { url: 'https://www.phusionpassenger.com/' },
    Jetty: { brand: 'eclipsejetty', url: 'https://jetty.org/' },
    Cowboy: { url: 'https://ninenines.eu/' },
    Apache: { title: 'Apache HTTP Server', icon: 'apache.png', url: 'https://httpd.apache.org/' },
    nginx: { icon: 'nginx.png', url: 'https://nginx.org/' },
    OpenResty: { url: 'https://openresty.org/' },
    IIS: { icon: 'iis.png', url: 'https://www.iis.net/' },
    LiteSpeed: { url: 'https://www.litespeedtech.com/' },
    Caddy: { brand: 'caddy', url: 'https://caddyserver.com/' },
    Envoy: { brand: 'envoyproxy', url: 'https://www.envoyproxy.io/' },
};

const Hosting: Record<string, ToolInfo> = {
    Cloudflare: { brand: 'cloudflare', url: 'https://www.cloudflare.com/' },
    Vercel: { brand: 'vercel', url: 'https://vercel.com/' },
    Netlify: { brand: 'netlify', url: 'https://www.netlify.com/' },
    'Google Cloud': { brand: 'googlecloud', url: 'https://cloud.google.com/' },
    'Amazon CloudFront': { url: 'https://aws.amazon.com/cloudfront/' },
    'Amazon S3': { url: 'https://aws.amazon.com/s3/' },
    'Azure Front Door': { url: 'https://azure.microsoft.com/products/frontdoor' },
    Fastly: { brand: 'fastly', url: 'https://www.fastly.com/' },
    Akamai: { brand: 'akamai', url: 'https://www.akamai.com/' },
    'GitHub Pages': { brand: 'github', url: 'https://pages.github.com/' },
    Heroku: { url: 'https://www.heroku.com/' },
    'Fly.io': { brand: 'flydotio', url: 'https://fly.io/' },
    Render: { brand: 'render', url: 'https://render.com/' },
    'WP Engine': { brand: 'wpengine', url: 'https://wpengine.com/' },
    Varnish: { icon: 'varnish.png', url: 'https://varnish-cache.org/' },
};

const Network: Record<string, ToolInfo> = {
    'HTTP/2': { icon: 'spdy.png', url: 'https://en.wikipedia.org/wiki/HTTP/2' },
    'HTTP/3': { icon: 'spdy.png', url: 'https://en.wikipedia.org/wiki/HTTP/3' },
};

const byCategory: [Category, Record<string, ToolInfo>][] = [
    ['Frameworks', Frameworks],
    ['Meta-frameworks & SSR', MetaFrameworks],
    ['CMS & platforms', Platforms],
    ['JavaScript libraries', Libraries],
    ['UI & styling', Ui],
    ['Build tools', BuildTools],
    ['Analytics & monitoring', Analytics],
    ['Widgets & services', Widgets],
    ['Advertising', Advertising],
    ['Server-side', ServerSide],
    ['Hosting & CDN', Hosting],
    ['Network', Network],
];

export const ToolMetadata: Record<string, Tool> = {};
for (const [category, tools] of byCategory) {
    const defaultPriority = Categories.find((c) => c.name === category)!.priority;
    for (const [id, info] of Object.entries(tools)) {
        ToolMetadata[id] = {
            ...info,
            id,
            title: info.title ?? id,
            icon: info.icon ?? (info.brand ? `brands/${info.brand}.svg` : undefined),
            category,
            priority: info.priority ?? defaultPriority,
        };
    }
}

/** Metadata for a detected id, including ids we have no metadata for. */
export function getTool(id: string): Tool {
    return (
        ToolMetadata[id] ?? {
            id,
            title: id,
            url: `https://www.google.com/search?q=${encodeURIComponent(id)}`,
            category: 'Widgets & services',
            priority: 10,
        }
    );
}
