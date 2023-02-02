
// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck

/*todo: move into ts - does the pageview object have a def?*/

function gtag() { dataLayer.push(arguments); }

export default function loadAnalytics(gaMeasurementId) {

    // if the environment doesn't have a measurement id, don't load analytics
    if (!Boolean(gaMeasurementId)) {
        return;
    }

    loadGaScript(gaMeasurementId);

    window.dataLayer = window.dataLayer || [];
//    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    const pageViewParams = getPiiSafePageView(gaMeasurementId);

    // set the config for auto generated events other than page_view
    gtag('config', gaMeasurementId, {
        send_page_view: false, //disable auto page_view measurement
        page_path: pageViewParams.page_path,
        page_location: pageViewParams.page_location,
        page_referrer: pageViewParams.referrer
    });

    // send the page_view event manually (https://developers.google.com/analytics/devguides/collection/gtagjs/pages#default_behavior)
    gtag('event', 'page_view', getPiiSafePageView(gaMeasurementId));
}

function loadGaScript(gaMeasurementId) {
    const f = document.getElementsByTagName('script')[0];
    const j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaMeasurementId;
    f.parentNode.insertBefore(j, f);
}

function getPiiSafePageView(gaMeasurementId) {

    const pageView = {
        page_title: document.title,
        send_to: gaMeasurementId
    };

    //todo: set as referrer or page_referrer in pageView - does it matter? is it only picking it up from the config?
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
