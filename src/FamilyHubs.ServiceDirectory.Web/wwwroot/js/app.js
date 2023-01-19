// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck
function loadAnalytics() {
    // ga side: https://www.youtube.com/watch?v=28d60ejfk3s
    // should we set up consent?: https://developers.google.com/tag-platform/devguides/consent#tag-manager
    if (!window.dataLayer) {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(), event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-W6QMSGQ');
        // nonce enabled version (if we decide to enable nonces)
        //
        // see: https://dev.to/matijamrkaic/using-google-tag-manager-with-a-content-security-policy-9ai
        // <script id="gtmScript" data-nonce="@Context.GetNonce()" asp-add-nonce>
        //
        //    (function (w, d, s, l, i) {
        //        w[l] = w[l] || [];
        //        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        //        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true;
        //        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; var n = d.querySelector('[nonce]'); n && j.setAttribute('nonce', n.nonce || n.getAttribute('nonce'));
        //        f.parentNode.insertBefore(j, f);
        //    }
        //    )(window, document, 'script', 'dataLayer', 'GTM-W6QMSGQ');
    }
}

/**
 * Cookie functions
 * ================
 *
 * Used by the cookie banner component and cookies page pattern.
 *
 * Includes function `Cookie()` for getting, setting, and deleting cookies, and
 * functions to manage the users' consent to cookies.
 *
 * Note: there is an inline script in cookie-banner.njk to show the banner
 * as soon as possible, to avoid a high Cumulative Layout Shift (CLS) score.
 * The consent cookie version is defined in cookie-banner.njk
 */
/* Name of the cookie to save users cookie preferences to. */
var CONSENT_COOKIE_NAME = 'service_directory_cookies_policy';
/* Google Analytics tracking IDs for preview and live environments. */
/*measurement ids or tag ids*/
/*Fatayi is going to link the existing ga (this id) into gtm (as a tag), then we can check the disabling*/
//var TRACKING_PREVIEW_ID = 'GA_TODO:STICKITHERE'
var TRACKING_LIVE_ID = 'G-30G6ZFTEJE';
/* Users can (dis)allow different groups of cookies. */
var COOKIE_CATEGORIES = {
    analytics: ['_ga', '_ga_' + TRACKING_LIVE_ID],
    /* Essential cookies
     *
     * Essential cookies cannot be deselected, but we want our cookie code to
     * only allow adding cookies that are documented in this object, so they need
     * to be added here.
     */
    essential: ['service_directory_cookies_policy']
};
/*
 * Default cookie preferences if user has no cookie preferences.
 *
 * Note that this doesn't include a key for essential cookies, essential
 * cookies cannot be disallowed. If the object contains { essential: false }
 * this will be ignored.
 */
var DEFAULT_COOKIE_CONSENT = {
    analytics: false
};
/*
 * Set, get, and delete cookies.
 *
 * Usage:
 *
 *   Setting a cookie:
 *   Cookie('hobnob', 'tasty', { days: 30 })
 *
 *   Reading a cookie:
 *   Cookie('hobnob')
 *
 *   Deleting a cookie:
 *   Cookie('hobnob', null)
 */
function Cookie(name, value, options) {
    if (typeof value !== 'undefined') {
        if (value === false || value === null) {
            deleteCookie(name);
        }
        else {
            // Default expiry date of 30 days
            if (typeof options === 'undefined') {
                options = { days: 30 };
            }
            setCookie(name, value, options);
        }
    }
    else {
        return getCookie(name);
    }
}
/** Return the user's cookie preferences.
 *
 * If the consent cookie is malformed, or not present,
 * returns null.
 */
function getConsentCookie() {
    var consentCookie = getCookie(CONSENT_COOKIE_NAME);
    var consentCookieObj;
    if (consentCookie) {
        try {
            consentCookieObj = JSON.parse(consentCookie);
        }
        catch (err) {
            return null;
        }
    }
    else {
        return null;
    }
    return consentCookieObj;
}
/** Check the cookie preferences object.
 *
 * If the consent object is not present, malformed, or incorrect version,
 * returns false, otherwise returns true.
 *
 * This is also duplicated in cookie-banner.njk - the two need to be kept in sync
 */
function isValidConsentCookie(options) {
    return (options && options.version >= window.GDS_CONSENT_COOKIE_VERSION);
}
/** Update the user's cookie preferences. */
function setConsentCookie(options) {
    var cookieConsent = getConsentCookie();
    if (!cookieConsent) {
        cookieConsent = JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT));
    }
    // Merge current cookie preferences and new preferences
    for (var option in options) {
        cookieConsent[option] = options[option];
    }
    // Essential cookies cannot be deselected, ignore this cookie type
    delete cookieConsent.essential;
    cookieConsent.version = window.GDS_CONSENT_COOKIE_VERSION;
    // Set the consent cookie
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(cookieConsent), { days: 365 });
    // Update the other cookies
    resetCookies();
}
/** Apply the user's cookie preferences
 *
 * Deletes any cookies the user has not consented to.
 */
function resetCookies() {
    var options = getConsentCookie();
    // If no preferences or old version use the default
    if (!isValidConsentCookie(options)) {
        options = JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT));
    }
    for (var cookieType in options) {
        if (cookieType === 'version') {
            continue;
        }
        // Essential cookies cannot be deselected, ignore this cookie type
        if (cookieType === 'essential') {
            continue;
        }
        // Initialise analytics if allowed
        if (cookieType === 'analytics' && options[cookieType]) {
            // Enable GA if allowed
            window['ga-disable-' + TRACKING_LIVE_ID] = false;
            loadAnalytics();
        }
        else {
            // Disable GA if not allowed
            window['ga-disable-' + TRACKING_LIVE_ID] = true;
        }
        if (!options[cookieType]) {
            // Fetch the cookies in that category
            var cookiesInCategory = COOKIE_CATEGORIES[cookieType];
            cookiesInCategory.forEach(function (cookie) {
                // Delete cookie
                Cookie(cookie, null);
            });
        }
    }
}
function userAllowsCookieCategory(cookieCategory, cookiePreferences) {
    // Essential cookies are always allowed
    if (cookieCategory === 'essential') {
        return true;
    }
    // Sometimes cookiePreferences is malformed in some of the tests, so we need to handle these
    try {
        return cookiePreferences[cookieCategory];
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
function userAllowsCookie(cookieName) {
    // Always allow setting the consent cookie
    if (cookieName === CONSENT_COOKIE_NAME) {
        return true;
    }
    // Get the current cookie preferences
    var cookiePreferences = getConsentCookie();
    // If no preferences or old version use the default
    if (!isValidConsentCookie(cookiePreferences)) {
        cookiePreferences = DEFAULT_COOKIE_CONSENT;
    }
    for (var category in COOKIE_CATEGORIES) {
        var cookiesInCategory = COOKIE_CATEGORIES[category];
        if (cookiesInCategory.indexOf(cookieName) !== '-1') {
            return userAllowsCookieCategory(category, cookiePreferences);
        }
    }
    // Deny the cookie if it is not known to us
    return false;
}
function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');
    for (var i = 0, len = cookies.length; i < len; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}
// do we need to set the domain?
function setCookie(name, value, options) {
    if (userAllowsCookie(name)) {
        if (typeof options === 'undefined') {
            options = {};
        }
        var cookieString = name + '=' + value + '; path=/; SameSite=Strict';
        if (options.days) {
            var date = new Date();
            date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
            cookieString = cookieString + '; expires=' + date.toUTCString();
        }
        if (document.location.protocol === 'https:') {
            cookieString = cookieString + '; Secure';
        }
        document.cookie = cookieString;
    }
}
function deleteCookie(name) {
    if (Cookie(name)) {
        // Cookies need to be deleted in the same level of specificity in which they were set
        // If a cookie was set with a specified domain, it needs to be specified when deleted
        // If a cookie wasn't set with the domain attribute, it shouldn't be there when deleted
        // You can't tell if a cookie was set with a domain attribute or not, so try both options
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=' + window.location.hostname + ';path=/';
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.' + window.location.hostname + ';path=/';
    }
}

/**
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach(nodes, callback) {
    if (window.NodeList.prototype.forEach) {
        return nodes.forEach(callback);
    }
    for (var i = 0; i < nodes.length; i++) {
        callback.call(window, nodes[i], i, nodes);
    }
}

var cookieBannerAcceptSelector = '.js-cookie-banner-accept';
var cookieBannerRejectSelector = '.js-cookie-banner-reject';
var cookieBannerHideButtonSelector = '.js-cookie-banner-hide';
var cookieMessageSelector = '.js-cookie-banner-message';
var cookieConfirmationAcceptSelector = '.js-cookie-banner-confirmation-accept';
var cookieConfirmationRejectSelector = '.js-cookie-banner-confirmation-reject';
function CookieBanner($module) {
    this.$module = $module;
}
CookieBanner.prototype.init = function () {
    this.$cookieBanner = this.$module;
    this.$acceptButton = this.$module.querySelector(cookieBannerAcceptSelector);
    this.$rejectButton = this.$module.querySelector(cookieBannerRejectSelector);
    this.$cookieMessage = this.$module.querySelector(cookieMessageSelector);
    this.$cookieConfirmationAccept = this.$module.querySelector(cookieConfirmationAcceptSelector);
    this.$cookieConfirmationReject = this.$module.querySelector(cookieConfirmationRejectSelector);
    this.$cookieBannerHideButtons = this.$module.querySelectorAll(cookieBannerHideButtonSelector);
    // Exit if no cookie banner module
    // or if we're on the cookies page to avoid circular journeys
    if (!this.$cookieBanner || this.onCookiesPage()) {
        return;
    }
    // Show the cookie banner to users who have not consented or have an
    // outdated consent cookie
    var currentConsentCookie = getConsentCookie();
    if (!currentConsentCookie || !isValidConsentCookie(currentConsentCookie)) {
        // If the consent cookie version is not valid, we need to remove any cookies which have been
        // set previously
        resetCookies();
        this.$cookieBanner.removeAttribute('hidden');
    }
    this.$acceptButton.addEventListener('click', this.acceptCookies.bind(this));
    this.$rejectButton.addEventListener('click', this.rejectCookies.bind(this));
    nodeListForEach(this.$cookieBannerHideButtons, function ($cookieBannerHideButton) {
        $cookieBannerHideButton.addEventListener('click', this.hideBanner.bind(this));
    }.bind(this));
};
CookieBanner.prototype.hideBanner = function () {
    this.$cookieBanner.setAttribute('hidden', true);
};
CookieBanner.prototype.acceptCookies = function () {
    // Do actual cookie consent bit
    setConsentCookie({ analytics: true });
    // Hide banner and show confirmation message
    this.$cookieMessage.setAttribute('hidden', true);
    this.revealConfirmationMessage(this.$cookieConfirmationAccept);
};
CookieBanner.prototype.rejectCookies = function () {
    // Do actual cookie consent bit
    setConsentCookie({ analytics: false });
    // Hide banner and show confirmation message
    this.$cookieMessage.setAttribute('hidden', true);
    this.revealConfirmationMessage(this.$cookieConfirmationReject);
};
CookieBanner.prototype.revealConfirmationMessage = function (confirmationMessage) {
    confirmationMessage.removeAttribute('hidden');
    // Set tabindex to -1 to make the confirmation banner focusable with JavaScript
    if (!confirmationMessage.getAttribute('tabindex')) {
        confirmationMessage.setAttribute('tabindex', '-1');
        confirmationMessage.addEventListener('blur', function () {
            confirmationMessage.removeAttribute('tabindex');
        });
    }
    confirmationMessage.focus();
};
CookieBanner.prototype.onCookiesPage = function () {
    return window.location.pathname === '/cookies/';
};

function CookiesPage($module) {
    this.$module = $module;
}
CookiesPage.prototype.init = function () {
    this.$cookiePage = this.$module;
    if (!this.$cookiePage) {
        return;
    }
    this.$cookieForm = this.$cookiePage.querySelector('.js-cookies-page-form');
    this.$cookieFormFieldsets = this.$cookieForm.querySelectorAll('.js-cookies-page-form-fieldset');
    this.$successNotification = this.$cookiePage.querySelector('.js-cookies-page-success');
    this.$successLink = this.$cookiePage.querySelector('.js-cookies-page-success-link');
    nodeListForEach(this.$cookieFormFieldsets, function ($cookieFormFieldset) {
        this.showUserPreference($cookieFormFieldset, getConsentCookie());
        /*        $cookieFormFieldset.removeAttribute('hidden')*/
    }.bind(this));
    // Show submit button
    //this.$cookieForm.querySelector('.js-cookies-form-button').removeAttribute('hidden')
    this.$cookieForm.addEventListener('submit', this.savePreferences.bind(this));
};
CookiesPage.prototype.savePreferences = function (event) {
    // Stop default form submission behaviour
    event.preventDefault();
    var preferences = {};
    nodeListForEach(this.$cookieFormFieldsets, function ($cookieFormFieldset) {
        var cookieType = this.getCookieType($cookieFormFieldset);
        var selectedItem = $cookieFormFieldset.querySelector('input[name=' + cookieType + ']:checked').value;
        preferences[cookieType] = selectedItem === 'true';
    }.bind(this));
    // Save preferences to cookie and show success notification
    setConsentCookie(preferences);
    // handle the corner case, where the user has selected their preference on the cookie page, whilst the banner is still open as they haven't previously selected their preference
    //todo: call hideBanner
    var banner = document.querySelector('[data-module="govuk-cookie-banner"]');
    banner.setAttribute('hidden', 'true');
    this.showSuccessNotification();
};
CookiesPage.prototype.showUserPreference = function ($cookieFormFieldset, preferences) {
    var cookieType = this.getCookieType($cookieFormFieldset);
    var preference = false;
    if (cookieType && preferences && preferences[cookieType] !== undefined) {
        preference = preferences[cookieType];
    }
    var radioValue = preference ? 'true' : 'false';
    var radio = $cookieFormFieldset.querySelector('input[name=' + cookieType + '][value=' + radioValue + ']');
    radio.checked = true;
};
CookiesPage.prototype.showSuccessNotification = function () {
    this.$successNotification.removeAttribute('hidden');
    // if the user's come to the cookies page through the link in the cookie banner, show a link to take them back to the page they came from
    var referrer = document.referrer ? new URL(document.referrer).pathname : false;
    if (referrer && referrer !== document.location.pathname) {
        this.$successLink.href = referrer;
        this.$successLink.removeAttribute('hidden');
    }
    else {
        this.$successLink.setAttribute('hidden', 'true');
    }
    // Set tabindex to -1 to make the element focusable with JavaScript.
    // GOV.UK Frontend will remove the tabindex on blur as the component doesn't
    // need to be focusable after the user has read the text.
    if (!this.$successNotification.getAttribute('tabindex')) {
        this.$successNotification.setAttribute('tabindex', '-1');
    }
    this.$successNotification.focus();
    // scroll to the top of the page
    window.scrollTo(0, 0);
};
CookiesPage.prototype.getCookieType = function ($cookieFormFieldset) {
    return $cookieFormFieldset.id;
};

// js components have been snaffled from https://github.com/alphagov/govuk-design-system/blob/main/src/javascripts/components/
// Initialise cookie banner
var $cookieBanner = document.querySelector('[data-module="govuk-cookie-banner"]');
new CookieBanner($cookieBanner).init();
// Initialise analytics if consent is given
var userConsent = getConsentCookie();
if (userConsent && isValidConsentCookie(userConsent) && userConsent.analytics) {
    loadAnalytics();
}
//todo: move this into scripts section on cookie page
// Initialise cookie page
var $cookiesPage = document.querySelector('[data-module="app-cookies-page"]');
new CookiesPage($cookiesPage).init();
const backLinks = document.querySelectorAll(".app-back-link");
backLinks.forEach((link) => {
    link.addEventListener("click", () => {
        window.history.back();
    });
});
const button = document.getElementById('open-close-filters');
button === null || button === void 0 ? void 0 : button.addEventListener('click', function handleClick(event) {
    //todo: update to ts 2?
    const filterButton = document.getElementById("filters");
    if (filterButton.style.display === "none") {
        filterButton.style.display = "block";
    }
    else {
        filterButton.style.display = "none";
    }
});
