
// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck

export default function loadAnalytics(gaMeasurementId) {

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaMeasurementId,
        {
            'page_path': getPiiSafeLocation()
        });


//    if (!window.dataLayer) {

//        //https://developers.google.com/tag-platform/tag-manager/web/datalayer
//        window.dataLayer = window.dataLayer || [];

//        //does ga side need to define the Custom Page Path data layer variable?
//        //https://www.bounteous.com/insights/2018/03/30/single-page-applications-google-analytics
//        window['dataLayer'].push({
//            'event': 'config',
//            'config': {
//                'GTM-W6QMSGQ': {
//                    'page_path': getPiiSafeLocation()
//                }
//            }
//        });

//        (function (w, d, s, l, i) {
//            w[l] = w[l] || []; w[l].push({
//                'gtm.start':
//                    new Date().getTime(), event: 'gtm.js'
//            }); var f = d.getElementsByTagName(s)[0],
//                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
//                'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
//        })(window, document, 'script', 'dataLayer', 'GTM-W6QMSGQ');
//    }
}

/*todo: if keep, prob doesn't belong here*/
function getPiiSafeLocation() {
    // if GTM has been set up to accept a relative path
    const path = window.location.pathname;
    const queryString = window.location.search;

    const queryParams = new URLSearchParams(queryString);

    var postcode = queryParams.get("postcode");
    if (postcode == null) {
        return path + queryString;
    }
    postcode = postcode.replace(/[a-zA-Z]+$/, "");
    queryParams.set("postcode", postcode);

    queryParams.delete("latitude");
    queryParams.delete("longitude");
    // adminDistrict gets a pass

    const newQueryParams = queryParams.toString();
    return path + "?" + newQueryParams;
}