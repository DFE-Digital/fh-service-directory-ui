// js components have been snaffled from https://github.com/alphagov/govuk-design-system/blob/main/src/javascripts/components/

declare global {
    interface Window {
        GDS_CONSENT_COOKIE_VERSION: any;
    }
}

import CookieBanner from '../wwwroot/js/components/cookie-banner.js'
import { getConsentCookie, isValidConsentCookie } from '../wwwroot/js/components/cookie-functions.js'
import Analytics from '../wwwroot/js/components/analytics.js'
import CookiesPage from '../wwwroot/js/components/cookies-page.js'

// Initialise cookie banner
var $cookieBanner = document.querySelector('[data-module="govuk-cookie-banner"]')
new CookieBanner($cookieBanner).init()

// Initialise analytics if consent is given
var userConsent = getConsentCookie()
if (userConsent && isValidConsentCookie(userConsent) && userConsent.analytics) {
    Analytics()
}

// Initialise cookie page
var $cookiesPage = document.querySelector('[data-module="app-cookies-page"]')
new CookiesPage($cookiesPage).init()

/*todo: don't use onclick??*/
function toggleFilters() {
    const filterButton = document.getElementById("filters") as HTMLDivElement | null;
    if (filterButton.style.display === "none") {
        filterButton.style.display = "block";
    } else {
        filterButton.style.display = "none";
    }
  }