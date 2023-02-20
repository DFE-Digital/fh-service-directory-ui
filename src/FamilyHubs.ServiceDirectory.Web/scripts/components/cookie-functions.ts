
export interface ConsentCookie {
    //todo: just remove essential?
    essential?: boolean;
    analytics?: boolean;
    version?: number;
}

interface CookieCategories {
    analytics: string[];
    essential: string[];
}

interface CookieOptions {
    days?: number;
}

/* Name of the cookie to save users cookie preferences to. */
const CONSENT_COOKIE_NAME = 'service_directory_cookies_policy';

/* Users can (dis)allow different groups of cookies. */
const COOKIE_CATEGORIES: CookieCategories = {
    analytics: ['_ga', '_ga_' + window.GA_CONTAINER_ID],
    /* Essential cookies
     *
     * Essential cookies cannot be deselected, but we want our cookie code to
     * only allow adding cookies that are documented in this object, so they need
     * to be added here.
     */
    essential: ['service_directory_cookies_policy']
}

/*
 * Default cookie preferences if user has no cookie preferences.
 *
 * Note that this doesn't include a key for essential cookies, essential
 * cookies cannot be disallowed. If the object contains { essential: false }
 * this will be ignored.
 */
const DEFAULT_COOKIE_CONSENT: ConsentCookie = {
    analytics: false,
    version: window.GDS_CONSENT_COOKIE_VERSION
}

/** Return the user's cookie preferences.
 *
 * If the consent cookie is malformed, or not present,
 * returns null.
 */
export function getConsentCookie(): ConsentCookie | null {
    const consentCookie = getCookie(CONSENT_COOKIE_NAME);
    let consentCookieObj: ConsentCookie | null;

    if (consentCookie) {
        try {
            consentCookieObj = JSON.parse(consentCookie);
        } catch (err) {
            return null;
        }
    } else {
        return null;
    }

    return consentCookieObj;
}

/** Check the cookie preferences object.
 *
 * If the consent object is not present, malformed, or incorrect version,
 * returns false, otherwise returns true.
 */
export function isValidConsentCookie(options: ConsentCookie) {
    return (options && options.version >= window.GDS_CONSENT_COOKIE_VERSION);
}

/** Update the user's cookie preferences. */
export function setConsentCookie(options: ConsentCookie) {
    let cookieConsent = getConsentCookie();

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
export function resetCookies() {
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

        if (!options[cookieType]) {
            // Fetch the cookies in that category
            var cookiesInCategory = COOKIE_CATEGORIES[cookieType]

            cookiesInCategory.forEach(function (cookie) {
                deleteCookie(cookie);
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
    } catch (e) {
        console.error(e);
        return false;
    }
}

function userAllowsCookie(cookieName: string) {
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

function getCookie(name: string) {
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
function setCookie(name: string, value: string, options?: CookieOptions) {
    if (userAllowsCookie(name)) {
        if (typeof options === 'undefined') {
            options = {}
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

function deleteCookie(name: string) {
    if (getCookie(name)) {
        // Cookies need to be deleted in the same level of specificity in which they were set
        // If a cookie was set with a specified domain, it needs to be specified when deleted
        // If a cookie wasn't set with the domain attribute, it shouldn't be there when deleted
        // You can't tell if a cookie was set with a domain attribute or not, so try both options
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=' + window.location.hostname + ';path=/';
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.' + window.location.hostname + ';path=/';
    }
}