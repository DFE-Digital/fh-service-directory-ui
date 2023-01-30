
// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck

function gtag() { dataLayer.push(arguments); }

export default function loadAnalytics(gaMeasurementId) {

    window.dataLayer = window.dataLayer || [];
//    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    addFormInteractionGa4Events();

    //todo: if we keep this, will have to update cookie-function

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

function addFormInteractionGa4Events(gaMeasurementId) {
    // form_destination can't be overriden in form_start & form_submit (without adding ga4 to gtm)
    // so instead disable auto form interactions and send them manually

    const forms = document.querySelectorAll('form');
    for (let i = 0; i < forms.length; ++i) {

        const formId = forms[i].id || '';
        const formName = forms[i].name || null;
        let formDestination = forms[i].action || '';

        const urlArray = formDestination.split("?");

        const piiSafeDestinationQueryString = getPiiSafeQueryString(urlArray[1]);
        if (piiSafeDestinationQueryString != null) {
            formDestination = urlArray[0] + piiSafeDestinationQueryString;
        }

//todo: make match
// manual:                        Processing GTAG command: ["event", "form_submit", {event_category: "form", form_type: "submit", event_label: "", form_id: "", form_name: "", form_destination: "https://localhost:7199/ServiceFilter?postcode=M27+8&adminDistrict=E08000006"}]
// manual:                        Processing GTAG command: ["event", "form_submit", {form_id: "", form_name: "", form_destination: "https://localhost:7199/ServiceFilter?postcode=M27+8&adminDistrict=E08000006"}]
// auto  : js?id=G-TD99KTZEE1:173 Processing GTAG command: ["event", "form_submit", {form_id: "", form_name: null, form_destination: "https://localhost:7199/ServiceFilter?postcode=M27%208SS&adminDistrict=E08000006&latitude=53.508885&longitude=-2.294605", form_length: 75, form_submit_text: undefined, event_callback: [function], send_to: "G-TD99KTZEE1"}]

//todo: gtag is undefined

/*        const formLength = event.target.elements.length;*/

        forms[i].addEventListener('submit', (event) => {
            gtag('event', 'form_submit', {
                //'event_category': 'form',
                //'form_type': 'submit',
                //'event_label': formId,
                'form_id': formId,
                'form_name': formName,
                'form_destination': formDestination,
                //form_length: formLength,
                send_to: gaMeasurementId
            });
        });

        forms[i].addEventListener('focus', (event) => {

            // js?id=G-TD99KTZEE1:173 Processing GTAG command: ["event", "form_start", {form_id: "", form_name: null, form_destination: "https://localhost:7199/ServiceFilter?postcode=M27%208SS&adminDistrict=E08000006&latitude=53.508885&longitude=-2.294605", form_length: 74, first_field_id: "children_and_young-option-selected", first_field_name: "children_and_young-option-selected", first_field_type: "checkbox", first_field_position: 53, send_to: "G-TD99KTZEE1"}]

            gtag('event', 'form_start', {
                //'event_category': 'form',
                //'form_type': 'start',
                //'event_label': formId,
                'form_id': formId,
                'form_name': formName,
                'form_destination': formDestination,
                //form_length: formLength,
                send_to: gaMeasurementId
            });
        });
    }
}

/*todo: move into ts - does the pageview object have a def?*/
/*todo: send events from the server for when js disabled??*/

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