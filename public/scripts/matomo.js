// Matomo Setup
const _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push([
    'setDomains',
    ['*.tracer.finance', '*.docs.tracer.finance', '*.pools.tracer.finance', '*.vote.tracer.finance/'],
]);
_paq.push(['enableCrossDomainLinking']);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function () {
    const u = 'https://tracerfinance.matomo.cloud/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '4']);
    const d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = '//cdn.matomo.cloud/tracerfinance.matomo.cloud/matomo.js';
    s.parentNode.insertBefore(g, s);
})();

// Matomo tag manager
const _mtm = (window._mtm = window._mtm || []);
_mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
const d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0];
g.async = true;
g.src = 'https://cdn.matomo.cloud/tracerfinance.matomo.cloud/container_9pOj4o6E.js';
s.parentNode.insertBefore(g, s);
