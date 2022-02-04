// Matomo Setup
let _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["setDomains", ["*.tracer.finance", "*.docs.tracer.finance", "*.pools.tracer.finance", "*.vote.tracer.finance/"]]),
    _paq.push(["enableCrossDomainLinking"]),
    _paq.push(["trackPageView"]),
    _paq.push(["enableLinkTracking"]),
    (function () {
        _paq.push(["setTrackerUrl", "/matomo-php"]), _paq.push(["setSiteId", "2"]);
        let e = document,
            t = e.createElement("script"),
            a = e.getElementsByTagName("script")[0];
        (t.async = !0), (t.src = "/scripts/mat.js"), a.parentNode.insertBefore(t, a);
    })();
let _mtm = (window._mtm = window._mtm || []);
_mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
let d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
(g.async = !0), (g.src = "/scripts/mat-container.js"), s.parentNode.insertBefore(g, s);
