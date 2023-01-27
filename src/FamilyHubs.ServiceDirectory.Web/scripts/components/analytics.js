
// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck

export default function loadAnalytics(gaMeasurementId) {

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaMeasurementId, {
        'page_view': {
            'page_path': getPiiSafePagePath(),
            'page_location': getPiiSafePageLocation()
        }
    });
}

/*todo: if keep, these prob don't belong here*/
/*todo: also func to get both*/

function getPiiSafePageLocation() {
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

function getPiiSafePagePath() {
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