// js components have been snaffled from https://github.com/alphagov/govuk-design-system/blob/main/src/javascripts/components/

declare global {
    interface Window {
        GDS_CONSENT_COOKIE_VERSION: number;
        GA_MEASUREMENT_ID: string;
        GA_CONTAINER_ID: string;
        dataLayer: any[];
    }
}

import CookieBanner from './components/cookie-banner.js'
import { getConsentCookie, isValidConsentCookie } from './components/cookie-functions.js'
import CookiesPage from './components/cookies-page.js'
import Analytics from './components/analytics';

// Initialise cookie banner
var $cookieBanner = document.querySelector('[data-module="govuk-cookie-banner"]')
new CookieBanner($cookieBanner).init()

// Initialise analytics if consent is given
var userConsent = getConsentCookie();
if (userConsent && isValidConsentCookie(userConsent) && userConsent.analytics) {
    const analytics = new Analytics(window.GA_MEASUREMENT_ID);
}

//todo: move this into scripts section on cookie page
// Initialise cookie page
var $cookiesPage = document.querySelector('[data-module="app-cookies-page"]')
new CookiesPage($cookiesPage).init()

const backLinks = document.querySelectorAll(".app-back-link");
backLinks.forEach((link: HTMLAnchorElement) => {
    link.addEventListener("click", () => {
        window.history.back();
    });
});

const button = document.getElementById('open-close-filters');
button?.addEventListener('click', function handleClick(event) {
    //todo: update to ts 2?
    const filterButton = document.getElementById("filters") as HTMLDivElement | null;
    if (filterButton.style.display === "none") {
        filterButton.style.display = "block";
    } else {
        filterButton.style.display = "none";
    }
});
