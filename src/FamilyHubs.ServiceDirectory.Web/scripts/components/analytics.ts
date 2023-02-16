
function gtag(command: string, ...args: any[]): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
}

let GaMeasurementId: string = '';

//todo: use prototype? (or class?)
//todo: initAnalytics will have to be called irrespective of the current accept/decline cookie status
export default function initAnalytics(gaMeasurementId: string) {

    // if the environment doesn't have a measurement id, don't load analytics
    if (!Boolean(gaMeasurementId)) {
        return;
    }

    GaMeasurementId = gaMeasurementId;

    setDefaultConsent();

    loadGaScript(gaMeasurementId);

    gtag('js', new Date());

    const pageViewParams = getPiiSafePageView(gaMeasurementId);

    // set the config for auto generated events other than page_view
    gtag('config', gaMeasurementId, {
        send_page_view: false, //disable auto page_view measurement
        page_path: pageViewParams.page_path,
        page_location: pageViewParams.page_location,
        page_referrer: pageViewParams.referrer,
        cookie_flags: 'secure'
    });
}

function setDefaultConsent() {
    gtag('consent', 'default', {
        'analytics_storage': 'denied'
    });

    gtag('set', 'url_passthrough', true);
}

export function updateAnalyticsStorageConsent(granted: boolean) {
    gtag('consent', 'update', {
        'analytics_storage': granted ? 'granted' : 'denied'
    });
}

export function sendPageViewEvent() {
    // send the page_view event manually (https://developers.google.com/analytics/devguides/collection/gtagjs/pages#default_behavior)
    gtag('event', 'page_view', getPiiSafePageView(GaMeasurementId));
}

export function sendFilterPageCustomEvent() {
    //todo: make filter page only
    const element = document.getElementById('results');
    const totalResults = element?.getAttribute('data-total-results');
    if (totalResults === undefined)
        return;

    gtag('event', 'filter_page', {
        'total_results': totalResults
    });
}

//todo: or accepted|rejected
export function sendAnalyticsCustomEvent(accepted: boolean, source: string) {

    gtag('event', 'analytics', {
        'accepted': accepted,
        'source': source
    });
}

//todo: having an object (prototype/class) will ensure that GaMeasurementId will have already been set
export function disableAnalytics()
{
    //gtag('config', GaMeasurementId, {
    //    'allow_ad_personalization_signals': false,
    //    'allow_google_signals': false,
    //    'scroll_threshold': 0,
    //    'link_attribution': false
    //});

    //gtag('set', {
    //    'allow_google_signals': false,
    //    'custom_map': {
    //        'scroll': 'non_interaction'
    //    }
    //});

    // this kills our custom event, but not ga4's own events which must be caching the measurement id
    //window.dataLayer = [];
    //gtag('config', '');

//todo: when get working, ensure our own custom events and manual page_view events are not sent

    // in theory these should be enough to disable analytics. has it already checked these at load time rather than at send time?
    //window['ga-disable-' + GaMeasurementId] = true;

    //window["_gaUserPrefs"] = { ioo() { return true; } }

    //possible options
    // send the custom event without loading the gtag script. possible?? not easily, and not maintainable
    // blatt the measurement id in the config? doesn't work - caching?
    // replace a central function in the gtag script? not maintainable?

    // issues:
    // gtag operates async, so how do we know when it's sent the custom event
    // we don't want a race condition (if we can disable ga4)
    // could use a promise
    // or could use a callback: https://developers.google.com/tag-platform/gtagjs/reference/parameters

    //window.dataLayer.push({
    //    'event': 'ga-disable',
    //    'ga-disable': true
    //});

    //todo: unload the loaded script??
//    const gtagScript = document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]');
//    if (gtagScript) {
//        gtagScript.remove();
//    }

//}; aa.sl = function (a) { var b = this, c = TA(a); c ? Mh(c, function (d) { b.Eg(a, 1 === d.split("~").length ? void 0 : d) }) : this.Eg(a) }; var WB = function (a, b, c) { var d = a + "?" + b; Lk("Sending request: " + d); if (c) { Lk("  Request body: " + c); try { oc.sendBeacon && oc.sendBeacon(d, c) } catch (e) { xb("TAGGING", 15) } } else Fc(d) }, bC = Qm('', 500), cC = Qm('',
//    5E3), aC = !0; var dC = window, eC = document, fC = function (a) { var b = dC._gaUserPrefs; if (b && b.ioo && b.ioo() || a && !0 === dC["ga-disable-" + a]) return !0; try { var c = dC.external; if (c && c._gaUserPrefs && "oo" == c._gaUserPrefs) return !0 } catch (f) { } for (var d = Uk("AMP_TOKEN", String(eC.cookie), !0), e = 0; e < d.length; e++)if ("$OPT_OUT" == d[e]) return !0; return eC.getElementById("__gaOptOutExtension") ? !0 : !1 };

/*

function (a) { var b = dC._gaUserPrefs; if (b && b.ioo && b.ioo() || a && !0 === dC["ga-disable-" + a]) return !0;

    function (a)
    var dC = window
        !0 === dC["ga-disable-" + a]) return !0

        chat-gpt's interpretation of the code...

This is a function in Google Analytics 4 (GA4) that is used to check if tracking is enabled or disabled for a specific user.

Here's what the code is doing:

The function takes an argument a which represents the tracking ID (or "measurement ID" in GA4 terminology) for the Google Analytics property being tracked.
The function then checks if the user has enabled or disabled tracking for themselves. This is done by checking a variable called _gaUserPrefs which is set by the user's browser.
If _gaUserPrefs is defined and has a method called ioo that returns true, it means the user has disabled tracking for themselves. The function returns true to indicate that tracking is disabled.
If the a argument is provided and there is a cookie called "ga-disable-[measurement ID]" that is set to true, it means the user has explicitly disabled tracking for that particular property. The function returns true to indicate that tracking is disabled.
If neither of the above conditions are met, the function returns false to indicate that tracking is enabled for the user.
Overall, this function is used to determine if tracking is enabled or disabled for a specific user in GA4, based on the user's preferences and any explicit settings they may have set.

setting a property on window doesn't create a cookie, chat-gpt was hallucinating

        */
}

function loadGaScript(gaMeasurementId: string) {
    const f = document.getElementsByTagName('script')[0];
    const j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaMeasurementId;
    f.parentNode.insertBefore(j, f);
}

function getPiiSafePageView(gaMeasurementId: string) {

    const pageView = {
        page_title: document.title,
        send_to: gaMeasurementId,
        referrer: '',
        page_location: '',
        page_path: ''
    };

    //todo: set as referrer or page_referrer in pageView - does it matter? is it only picking it up from the config?
    //todo: get piisafe referrer function
    if (document.referrer !== '') {
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

    //todo: for safety, convert to lowercase, so that if the user changes the case of the url, we still don't collect pii
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
