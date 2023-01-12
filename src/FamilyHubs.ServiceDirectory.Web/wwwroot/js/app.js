// js components have been snaffled from https://github.com/alphagov/govuk-design-system/blob/main/src/javascripts/components/
import CookieBanner from './components/cookie-banner.js';
import { getConsentCookie, isValidConsentCookie } from './components/cookie-functions.js';
import Analytics from './components/analytics.js';
import CookiesPage from './components/cookies-page.js';
// Initialise cookie banner
var $cookieBanner = document.querySelector('[data-module="govuk-cookie-banner"]');
new CookieBanner($cookieBanner).init();
// Initialise analytics if consent is given
var userConsent = getConsentCookie();
if (userConsent && isValidConsentCookie(userConsent) && userConsent.analytics) {
    Analytics();
}
//todo: move this into scripts section on cookie page
// Initialise cookie page
var $cookiesPage = document.querySelector('[data-module="app-cookies-page"]');
new CookiesPage($cookiesPage).init();
const button = document.getElementById('open-close-filters');
button === null || button === void 0 ? void 0 : button.addEventListener('click', function handleClick(event) {
    const filterButton = document.getElementById("filters");
    if (filterButton.style.display === "none") {
        filterButton.style.display = "block";
    }
    else {
        filterButton.style.display = "none";
    }
});
//# sourceMappingURL=app.js.map