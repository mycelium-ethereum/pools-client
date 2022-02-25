// <!-- Matomo -->
let _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
_paq.push(["setCookieDomain", "*.tracer.finance"]);
_paq.push([
  "setDomains",
  [
    "*.tracer.finance",
    "*.docs.tracer.finance",
    "*.pools.tracer.finance",
    "*.vote.tracer.finance",
  ],
]);
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "https://tracerfinance.matomo.cloud/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "2"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = "//cdn.matomo.cloud/tracerfinance.matomo.cloud/matomo.js";
  s.parentNode.insertBefore(g, s);
})();
// <!-- End Matomo Code -->

// <!-- Matomo Tag Manager -->
let _mtm = (window._mtm = window._mtm || []);
_mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
var d = document,
  g = d.createElement("script"),
  s = d.getElementsByTagName("script")[0];
g.async = true;
g.src =
  "https://cdn.matomo.cloud/tracerfinance.matomo.cloud/container_9pOj4o6E.js";
s.parentNode.insertBefore(g, s);
// <!-- End Matomo Tag Manager -->
