"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_banner_js_1 = require("../wwwroot/js/components/cookie-banner.js");
var cookie_functions_js_1 = require("../wwwroot/js/components/cookie-functions.js");
var analytics_js_1 = require("../wwwroot/js/components/analytics.js");
var cookies_page_js_1 = require("../wwwroot/js/components/cookies-page.js");
// Initialise cookie banner
var $cookieBanner = document.querySelector('[data-module="govuk-cookie-banner"]');
new cookie_banner_js_1.default($cookieBanner).init();
// Initialise analytics if consent is given
var userConsent = (0, cookie_functions_js_1.getConsentCookie)();
if (userConsent && (0, cookie_functions_js_1.isValidConsentCookie)(userConsent) && userConsent.analytics) {
    (0, analytics_js_1.default)();
}
// Initialise cookie page
var $cookiesPage = document.querySelector('[data-module="app-cookies-page"]');
new cookies_page_js_1.default($cookiesPage).init();
/*todo: don't use onclick??*/
function toggleFilters() {
    var filterButton = document.getElementById("filters");
    if (filterButton.style.display === "none") {
        filterButton.style.display = "block";
    }
    else {
        filterButton.style.display = "none";
    }
}
//# sourceMappingURL=app.js.map