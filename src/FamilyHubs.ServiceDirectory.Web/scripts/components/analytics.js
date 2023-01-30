
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

    const pageViewParams = getPiiSafePageView(gaMeasurementId);

    gtag('config', gaMeasurementId, {
        send_page_view: false,
        page_path: pageViewParams.page_path,
        page_location: pageViewParams.page_location
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

    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);

    let postcode = queryParams.get("postcode");
    if (postcode == null) {
        pageView.page_location = window.location.href;
        pageView.page_path = window.location.pathname + queryString;

        return pageView;
    }

    postcode = postcode.replace(/[a-zA-Z]+$/, "");
    queryParams.set("postcode", postcode);
    queryParams.delete("latitude");
    queryParams.delete("longitude");

    const newQueryParams = '?' + queryParams.toString();

    const urlArray = window.location.href.split("?");

    pageView.page_location = urlArray[0] + newQueryParams;
    pageView.page_path = window.location.pathname + newQueryParams;

    return pageView;
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