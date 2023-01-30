
// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck

export default function loadAnalytics(gaMeasurementId) {

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    // disable pageview measurement and send the page_view event manually (https://developers.google.com/analytics/devguides/collection/gtagjs/pages#default_behavior)

    //todo: if we keep this, will have to update cookie-function

    // form_destination can't be overriden in form_start & form_submit (without adding ga4 to gtm)
    // so instead disable auto form interactions and send them manually

    //todo: send/override referer for page_views (check host, or just look for postcode?)

    const pageViewParams = getPiiSafePageView(gaMeasurementId);

    // set the config for auto generated events other than page_view
    gtag('config', gaMeasurementId, {
        send_page_view: false,
        page_path: pageViewParams.page_path,
        page_location: pageViewParams.page_location,
        //referrer: pageViewParams.referrer
        page_referrer: pageViewParams.referrer
    });

    gtag('event', 'page_view', getPiiSafePageView(gaMeasurementId));
}

/*todo: if keep, these prob don't belong here*/
/*todo: test*/
/*todo: move into ts - does the pageview object have a def?*/
/*todo: make sure we have all the params for page_view - compare with the default, e.g. user_agent */
/*todo: path & location for all auto sent events */

function getPiiSafePageView(gaMeasurementId) {

    const pageView = {
        page_title: document.title,
        send_to: gaMeasurementId
    };

    //todo: get piisafe referrer function
    if (document.referrer === '') {
        pageView.referrer = '';
    } else {
        const referrerUrl = new URL(document.referrer);
        const piiSafeReferrerQueryString = getPiiSafeQueryString(referrerUrl.search);
        if (piiSafeReferrerQueryString == null) {
            pageView.referrer = document.referrer;
        } else {
            const urlArray = document.referrer.split("?");

            pageView.referrer = urlArray[0] + piiSafeReferrerQueryString;
        }
    }

    const piiSafeQueryString = getPiiSafeQueryString(window.location.search);

    if (piiSafeQueryString == null) {
        pageView.page_location = window.location.href;
        pageView.page_path = window.location.pathname + window.location.search;

        return pageView;
    }

    const urlArray = window.location.href.split("?");

    pageView.page_location = urlArray[0] + piiSafeQueryString;
    pageView.page_path = window.location.pathname + piiSafeQueryString;

    return pageView;
}

function getPiiSafeQueryString(queryString) {

    const queryParams = new URLSearchParams(queryString);

    let postcode = queryParams.get("postcode");
    if (postcode == null) {
        // null indicates original query params were already pii safe
        return null;
    }

    postcode = postcode.replace(/[a-zA-Z]+$/, "");
    queryParams.set("postcode", postcode);
    queryParams.delete("latitude");
    queryParams.delete("longitude");

    return '?' + queryParams.toString();
}

//function getPiiSafePageLocation() {
//    var location = window.location.href;
//    var urlArray = location.split("?");
//    var queryParams = new URLSearchParams(urlArray[1]);

//    var postcode = queryParams.get("postcode");
//    if (postcode == null) {
//        return location;
//    }
//    postcode = postcode.replace(/[a-zA-Z]+$/, "");
//    queryParams.set("postcode", postcode);
//    queryParams.delete("latitude");
//    queryParams.delete("longitude");
//    // adminDistrict gets a pass

//    var newQueryParams = queryParams.toString();
//    var newUrl = urlArray[0] + "?" + newQueryParams;
//    return newUrl;
//}

//function getPiiSafePagePath() {
//    const path = window.location.pathname;
//    const queryString = window.location.search;

//    const queryParams = new URLSearchParams(queryString);

//    var postcode = queryParams.get("postcode");
//    if (postcode == null) {
//        return path + queryString;
//    }
//    postcode = postcode.replace(/[a-zA-Z]+$/, "");
//    queryParams.set("postcode", postcode);

//    queryParams.delete("latitude");
//    queryParams.delete("longitude");
//    // adminDistrict gets a pass

//    const newQueryParams = queryParams.toString();
//    return path + "?" + newQueryParams;
//}