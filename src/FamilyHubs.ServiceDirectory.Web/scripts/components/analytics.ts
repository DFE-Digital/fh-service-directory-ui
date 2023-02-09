
function gtag(command: string, ...args: any[]): void {
    window.dataLayer.push(arguments);
}

//todo: just a module, rather than a class

export default class Analytics {

    constructor(gaMeasurementId: string) {

        // if the environment doesn't have a measurement id, don't load analytics
        if (!Boolean(gaMeasurementId)) {
            return;
        }

        this.loadGaScript(gaMeasurementId);

        window.dataLayer = window.dataLayer || [];
    //    function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        const pageViewParams = this.getPiiSafePageView(gaMeasurementId);

        // set the config for auto generated events other than page_view
        gtag('config', gaMeasurementId, {
            send_page_view: false, //disable auto page_view measurement
            page_path: pageViewParams.page_path,
            page_location: pageViewParams.page_location,
            page_referrer: pageViewParams.referrer
        });

        // send the page_view event manually (https://developers.google.com/analytics/devguides/collection/gtagjs/pages#default_behavior)
        gtag('event', 'page_view', this.getPiiSafePageView(gaMeasurementId));
    }

    loadGaScript(gaMeasurementId : string) {
        const f = document.getElementsByTagName('script')[0];
        const j = document.createElement('script');
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaMeasurementId;
        f.parentNode.insertBefore(j, f);
    }

    getPiiSafePageView(gaMeasurementId: string) {

        //todo: ConfigParams interface

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
            const piiSafeReferrerQueryString = this.getPiiSafeQueryString(referrerUrl.search);
            if (piiSafeReferrerQueryString == null) {
                pageView.referrer = document.referrer;
            } else {
                const urlArray = document.referrer.split("?");

                pageView.referrer = urlArray[0] + piiSafeReferrerQueryString;
            }
        }

        const piiSafeQueryString = this.getPiiSafeQueryString(window.location.search);

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

    getPiiSafeQueryString(queryString) {

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
}
