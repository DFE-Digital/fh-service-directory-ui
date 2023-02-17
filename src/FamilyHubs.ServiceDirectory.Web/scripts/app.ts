// js components were originally snaffled from https://github.com/alphagov/govuk-design-system/blob/main/src/javascripts/components/

declare global {
    interface Window {
        GDS_CONSENT_COOKIE_VERSION: number;
        GA_MEASUREMENT_ID: string;
        GA_CONTAINER_ID: string;
        dataLayer: any[];
    }
}

import CookieBanner from './components/cookie-banner.js'
import CookiesPage from './components/cookies-page.js'
import initAnalytics, { sendPageViewEvent, sendFilterPageCustomEvent, updateAnalyticsStorageConsent } from './components/analytics';
import { nodeListForEach } from './components/helpers.js';

//todo: consistency in module/proto/class style

// Initialise cookie banner
const $cookieBanner = document.querySelector('[data-module="govuk-cookie-banner"]') as HTMLElement | null;
new CookieBanner($cookieBanner).init();

initAnalytics(window.GA_MEASUREMENT_ID);

//todo: move this into scripts section on cookie page
// Initialise cookie page
var $cookiesPage = document.querySelector('[data-module="app-cookies-page"]')
new CookiesPage($cookiesPage).init()

//todo: move into module
const backLinks = document.querySelectorAll(".app-back-link");
nodeListForEach(backLinks, (link: HTMLAnchorElement) => {
    link.addEventListener("click", () => {
        window.history.back();
    });
});

const button = document.getElementById('open-close-filters');
button?.addEventListener('click', function handleClick(event) {
    const filterButton = document.getElementById("filters") as HTMLDivElement | null;
    if (filterButton.style.display === "none") {
        filterButton.style.display = "block";
    } else {
        filterButton.style.display = "none";
    }
});
