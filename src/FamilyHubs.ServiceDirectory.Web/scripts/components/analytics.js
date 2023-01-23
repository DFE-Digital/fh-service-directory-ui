
// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck

export default function loadAnalytics() {

    // ga side: https://www.youtube.com/watch?v=28d60ejfk3s
    // should we set up consent?: https://developers.google.com/tag-platform/devguides/consent#tag-manager

    if (!window.dataLayer) {

        // is this too early?
        //ga('set', 'location', getPiiSafeLocation());
        //gtag('config', 'GA_MEASUREMENT_ID', { 'page_path': getPiiSafeLocation() });

        //https://developers.google.com/tag-platform/tag-manager/web/datalayer

        window.dataLayer = window.dataLayer || [];

        //does ga side need to define the Custom Page Path data layer variable?
        //https://www.bounteous.com/insights/2018/03/30/single-page-applications-google-analytics
        window['dataLayer'].push({
            'event': 'config',
            'config': {
                'GTM-W6QMSGQ': {
                    'page_path': getPiiSafeLocation()
                }
            }
        });

        (function (w, d, s, l, i) {
            w[l] = w[l] || []; w[l].push({
                'gtm.start':
                    new Date().getTime(), event: 'gtm.js'
            }); var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-W6QMSGQ');

    // nonce enabled version (if we decide to enable nonces)
    //
    // see: https://dev.to/matijamrkaic/using-google-tag-manager-with-a-content-security-policy-9ai
    // <script id="gtmScript" data-nonce="@Context.GetNonce()" asp-add-nonce>
    //
    //    (function (w, d, s, l, i) {
    //        w[l] = w[l] || [];
    //        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    //        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true;
    //        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; var n = d.querySelector('[nonce]'); n && j.setAttribute('nonce', n.nonce || n.getAttribute('nonce'));
    //        f.parentNode.insertBefore(j, f);
    //    }
    //    )(window, document, 'script', 'dataLayer', 'GTM-W6QMSGQ');
    }
}

//export function removeAnalytics() {
//    // remove the script tag
//    var script = document.getElementById('gtmScript');
//    script.parentNode.removeChild(script);
//}

function getPiiSafeLocation() {
    var location = window.location.href;
    var urlArray = location.split("?");
    var queryParams = new URLSearchParams(urlArray[1]);

    var postcode = queryParams.get("postcode");
    if (postcode == null) {
        return location;
    }
    postcode = postcode.replace(/[a-zA-Z]+$/, "");
    queryParams.set("postcode", postcode);

    queryParams.delete("latitude");
    queryParams.delete("longitude");
    // adminDistrict gets a pass

    var newQueryParams = queryParams.toString();
    var newUrl = urlArray[0] + "?" + newQueryParams;
    return newUrl;
}