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
import Analytics from './analytics.js';
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
export function Cookie(name, value, options) {
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
export function getConsentCookie() {
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
export function isValidConsentCookie(options) {
    return (options && options.version >= window.GDS_CONSENT_COOKIE_VERSION);
}
/** Update the user's cookie preferences. */
export function setConsentCookie(options) {
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
        // Initialise analytics if allowed
        if (cookieType === 'analytics' && options[cookieType]) {
            // Enable GA if allowed
            window['ga-disable-' + TRACKING_LIVE_ID] = false;
            Analytics();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29va2llLWZ1bmN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7O0dBWUc7QUFFSCxPQUFPLFNBQVMsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV0Qyw2REFBNkQ7QUFDN0QsSUFBSSxtQkFBbUIsR0FBRyxrQ0FBa0MsQ0FBQztBQUU3RCxzRUFBc0U7QUFDdEUsOEJBQThCO0FBQzlCLDBHQUEwRztBQUMxRyxpREFBaUQ7QUFDakQsSUFBSSxnQkFBZ0IsR0FBRyxjQUFjLENBQUM7QUFFdEMsdURBQXVEO0FBQ3ZELElBQUksaUJBQWlCLEdBQUc7SUFDcEIsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztJQUM3Qzs7Ozs7T0FLRztJQUNILFNBQVMsRUFBRSxDQUFDLGtDQUFrQyxDQUFDO0NBQ2xELENBQUE7QUFFRDs7Ozs7O0dBTUc7QUFDSCxJQUFJLHNCQUFzQixHQUFHO0lBQ3pCLFNBQVMsRUFBRSxLQUFLO0NBQ25CLENBQUE7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU87SUFDdkMsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7UUFDOUIsSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbkMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO2FBQU07WUFDSCxpQ0FBaUM7WUFDakMsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLEVBQUU7Z0JBQ2hDLE9BQU8sR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQTthQUN6QjtZQUNELFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO0tBQ0o7U0FBTTtRQUNILE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzFCO0FBQ0wsQ0FB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QUcsWUFBWSxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkU7UUFDRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUN6QyxZQUFZLEdBQUcsWUFBWSxHQUFHLFVBQVUsQ0FBQztTQUM1QztRQUNELFFBQVEsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0tBQ2xDO0FBQ0wsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQUk7SUFDdEIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDZCxxRkFBcUY7UUFDckYscUZBQXFGO1FBQ3JGLHVGQUF1RjtRQUN2Rix5RkFBeUY7UUFDekYsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsZ0RBQWdELENBQUM7UUFDMUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsaURBQWlELEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQ2xILFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLGtEQUFrRCxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztLQUN0SDtBQUNMLENBQUMiLCJmaWxlIjoiY29tcG9uZW50cy9jb29raWUtZnVuY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvb2tpZSBmdW5jdGlvbnNcclxuICogPT09PT09PT09PT09PT09PVxyXG4gKlxyXG4gKiBVc2VkIGJ5IHRoZSBjb29raWUgYmFubmVyIGNvbXBvbmVudCBhbmQgY29va2llcyBwYWdlIHBhdHRlcm4uXHJcbiAqXHJcbiAqIEluY2x1ZGVzIGZ1bmN0aW9uIGBDb29raWUoKWAgZm9yIGdldHRpbmcsIHNldHRpbmcsIGFuZCBkZWxldGluZyBjb29raWVzLCBhbmRcclxuICogZnVuY3Rpb25zIHRvIG1hbmFnZSB0aGUgdXNlcnMnIGNvbnNlbnQgdG8gY29va2llcy5cclxuICpcclxuICogTm90ZTogdGhlcmUgaXMgYW4gaW5saW5lIHNjcmlwdCBpbiBjb29raWUtYmFubmVyLm5qayB0byBzaG93IHRoZSBiYW5uZXJcclxuICogYXMgc29vbiBhcyBwb3NzaWJsZSwgdG8gYXZvaWQgYSBoaWdoIEN1bXVsYXRpdmUgTGF5b3V0IFNoaWZ0IChDTFMpIHNjb3JlLlxyXG4gKiBUaGUgY29uc2VudCBjb29raWUgdmVyc2lvbiBpcyBkZWZpbmVkIGluIGNvb2tpZS1iYW5uZXIubmprXHJcbiAqL1xyXG5cclxuaW1wb3J0IEFuYWx5dGljcyBmcm9tICcuL2FuYWx5dGljcy5qcydcclxuXHJcbi8qIE5hbWUgb2YgdGhlIGNvb2tpZSB0byBzYXZlIHVzZXJzIGNvb2tpZSBwcmVmZXJlbmNlcyB0by4gKi9cclxudmFyIENPTlNFTlRfQ09PS0lFX05BTUUgPSAnc2VydmljZV9kaXJlY3RvcnlfY29va2llc19wb2xpY3knO1xyXG5cclxuLyogR29vZ2xlIEFuYWx5dGljcyB0cmFja2luZyBJRHMgZm9yIHByZXZpZXcgYW5kIGxpdmUgZW52aXJvbm1lbnRzLiAqL1xyXG4vKm1lYXN1cmVtZW50IGlkcyBvciB0YWcgaWRzKi9cclxuLypGYXRheWkgaXMgZ29pbmcgdG8gbGluayB0aGUgZXhpc3RpbmcgZ2EgKHRoaXMgaWQpIGludG8gZ3RtIChhcyBhIHRhZyksIHRoZW4gd2UgY2FuIGNoZWNrIHRoZSBkaXNhYmxpbmcqL1xyXG4vL3ZhciBUUkFDS0lOR19QUkVWSUVXX0lEID0gJ0dBX1RPRE86U1RJQ0tJVEhFUkUnXHJcbnZhciBUUkFDS0lOR19MSVZFX0lEID0gJ0ctMzBHNlpGVEVKRSc7XHJcblxyXG4vKiBVc2VycyBjYW4gKGRpcylhbGxvdyBkaWZmZXJlbnQgZ3JvdXBzIG9mIGNvb2tpZXMuICovXHJcbnZhciBDT09LSUVfQ0FURUdPUklFUyA9IHtcclxuICAgIGFuYWx5dGljczogWydfZ2EnLCAnX2dhXycgKyBUUkFDS0lOR19MSVZFX0lEXSwgLy8gZG8gd2UgYWxzbyBuZWVkICdfZ2lkJyA/XHJcbiAgICAvKiBFc3NlbnRpYWwgY29va2llc1xyXG4gICAgICpcclxuICAgICAqIEVzc2VudGlhbCBjb29raWVzIGNhbm5vdCBiZSBkZXNlbGVjdGVkLCBidXQgd2Ugd2FudCBvdXIgY29va2llIGNvZGUgdG9cclxuICAgICAqIG9ubHkgYWxsb3cgYWRkaW5nIGNvb2tpZXMgdGhhdCBhcmUgZG9jdW1lbnRlZCBpbiB0aGlzIG9iamVjdCwgc28gdGhleSBuZWVkXHJcbiAgICAgKiB0byBiZSBhZGRlZCBoZXJlLlxyXG4gICAgICovXHJcbiAgICBlc3NlbnRpYWw6IFsnc2VydmljZV9kaXJlY3RvcnlfY29va2llc19wb2xpY3knXVxyXG59XHJcblxyXG4vKlxyXG4gKiBEZWZhdWx0IGNvb2tpZSBwcmVmZXJlbmNlcyBpZiB1c2VyIGhhcyBubyBjb29raWUgcHJlZmVyZW5jZXMuXHJcbiAqXHJcbiAqIE5vdGUgdGhhdCB0aGlzIGRvZXNuJ3QgaW5jbHVkZSBhIGtleSBmb3IgZXNzZW50aWFsIGNvb2tpZXMsIGVzc2VudGlhbFxyXG4gKiBjb29raWVzIGNhbm5vdCBiZSBkaXNhbGxvd2VkLiBJZiB0aGUgb2JqZWN0IGNvbnRhaW5zIHsgZXNzZW50aWFsOiBmYWxzZSB9XHJcbiAqIHRoaXMgd2lsbCBiZSBpZ25vcmVkLlxyXG4gKi9cclxudmFyIERFRkFVTFRfQ09PS0lFX0NPTlNFTlQgPSB7XHJcbiAgICBhbmFseXRpY3M6IGZhbHNlXHJcbn1cclxuXHJcbi8qXHJcbiAqIFNldCwgZ2V0LCBhbmQgZGVsZXRlIGNvb2tpZXMuXHJcbiAqXHJcbiAqIFVzYWdlOlxyXG4gKlxyXG4gKiAgIFNldHRpbmcgYSBjb29raWU6XHJcbiAqICAgQ29va2llKCdob2Jub2InLCAndGFzdHknLCB7IGRheXM6IDMwIH0pXHJcbiAqXHJcbiAqICAgUmVhZGluZyBhIGNvb2tpZTpcclxuICogICBDb29raWUoJ2hvYm5vYicpXHJcbiAqXHJcbiAqICAgRGVsZXRpbmcgYSBjb29raWU6XHJcbiAqICAgQ29va2llKCdob2Jub2InLCBudWxsKVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIENvb2tpZShuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlIHx8IHZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUNvb2tpZShuYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBEZWZhdWx0IGV4cGlyeSBkYXRlIG9mIDMwIGRheXNcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHsgZGF5czogMzAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZ2V0Q29va2llKG5hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiogUmV0dXJuIHRoZSB1c2VyJ3MgY29va2llIHByZWZlcmVuY2VzLlxyXG4gKlxyXG4gKiBJZiB0aGUgY29uc2VudCBjb29raWUgaXMgbWFsZm9ybWVkLCBvciBub3QgcHJlc2VudCxcclxuICogcmV0dXJucyBudWxsLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnNlbnRDb29raWUoKSB7XHJcbiAgICB2YXIgY29uc2VudENvb2tpZSA9IGdldENvb2tpZShDT05TRU5UX0NPT0tJRV9OQU1FKTtcclxuICAgIHZhciBjb25zZW50Q29va2llT2JqO1xyXG5cclxuICAgIGlmIChjb25zZW50Q29va2llKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc2VudENvb2tpZU9iaiA9IEpTT04ucGFyc2UoY29uc2VudENvb2tpZSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbnNlbnRDb29raWVPYmo7XHJcbn1cclxuXHJcbi8qKiBDaGVjayB0aGUgY29va2llIHByZWZlcmVuY2VzIG9iamVjdC5cclxuICpcclxuICogSWYgdGhlIGNvbnNlbnQgb2JqZWN0IGlzIG5vdCBwcmVzZW50LCBtYWxmb3JtZWQsIG9yIGluY29ycmVjdCB2ZXJzaW9uLFxyXG4gKiByZXR1cm5zIGZhbHNlLCBvdGhlcndpc2UgcmV0dXJucyB0cnVlLlxyXG4gKlxyXG4gKiBUaGlzIGlzIGFsc28gZHVwbGljYXRlZCBpbiBjb29raWUtYmFubmVyLm5qayAtIHRoZSB0d28gbmVlZCB0byBiZSBrZXB0IGluIHN5bmNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkQ29uc2VudENvb2tpZShvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gKG9wdGlvbnMgJiYgb3B0aW9ucy52ZXJzaW9uID49IHdpbmRvdy5HRFNfQ09OU0VOVF9DT09LSUVfVkVSU0lPTik7XHJcbn1cclxuXHJcbi8qKiBVcGRhdGUgdGhlIHVzZXIncyBjb29raWUgcHJlZmVyZW5jZXMuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDb25zZW50Q29va2llKG9wdGlvbnMpIHtcclxuICAgIHZhciBjb29raWVDb25zZW50ID0gZ2V0Q29uc2VudENvb2tpZSgpO1xyXG5cclxuICAgIGlmICghY29va2llQ29uc2VudCkge1xyXG4gICAgICAgIGNvb2tpZUNvbnNlbnQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfQ09PS0lFX0NPTlNFTlQpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNZXJnZSBjdXJyZW50IGNvb2tpZSBwcmVmZXJlbmNlcyBhbmQgbmV3IHByZWZlcmVuY2VzXHJcbiAgICBmb3IgKHZhciBvcHRpb24gaW4gb3B0aW9ucykge1xyXG4gICAgICAgIGNvb2tpZUNvbnNlbnRbb3B0aW9uXSA9IG9wdGlvbnNbb3B0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFc3NlbnRpYWwgY29va2llcyBjYW5ub3QgYmUgZGVzZWxlY3RlZCwgaWdub3JlIHRoaXMgY29va2llIHR5cGVcclxuICAgIGRlbGV0ZSBjb29raWVDb25zZW50LmVzc2VudGlhbDtcclxuXHJcbiAgICBjb29raWVDb25zZW50LnZlcnNpb24gPSB3aW5kb3cuR0RTX0NPTlNFTlRfQ09PS0lFX1ZFUlNJT047XHJcblxyXG4gICAgLy8gU2V0IHRoZSBjb25zZW50IGNvb2tpZVxyXG4gICAgc2V0Q29va2llKENPTlNFTlRfQ09PS0lFX05BTUUsIEpTT04uc3RyaW5naWZ5KGNvb2tpZUNvbnNlbnQpLCB7IGRheXM6IDM2NSB9KTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdGhlIG90aGVyIGNvb2tpZXNcclxuICAgIHJlc2V0Q29va2llcygpO1xyXG59XHJcblxyXG4vKiogQXBwbHkgdGhlIHVzZXIncyBjb29raWUgcHJlZmVyZW5jZXNcclxuICpcclxuICogRGVsZXRlcyBhbnkgY29va2llcyB0aGUgdXNlciBoYXMgbm90IGNvbnNlbnRlZCB0by5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldENvb2tpZXMoKSB7XHJcbiAgICB2YXIgb3B0aW9ucyA9IGdldENvbnNlbnRDb29raWUoKTtcclxuXHJcbiAgICAvLyBJZiBubyBwcmVmZXJlbmNlcyBvciBvbGQgdmVyc2lvbiB1c2UgdGhlIGRlZmF1bHRcclxuICAgIGlmICghaXNWYWxpZENvbnNlbnRDb29raWUob3B0aW9ucykpIHtcclxuICAgICAgICBvcHRpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX0NPT0tJRV9DT05TRU5UKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgY29va2llVHlwZSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKGNvb2tpZVR5cGUgPT09ICd2ZXJzaW9uJykge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVzc2VudGlhbCBjb29raWVzIGNhbm5vdCBiZSBkZXNlbGVjdGVkLCBpZ25vcmUgdGhpcyBjb29raWUgdHlwZVxyXG4gICAgICAgIGlmIChjb29raWVUeXBlID09PSAnZXNzZW50aWFsJykge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpc2UgYW5hbHl0aWNzIGlmIGFsbG93ZWRcclxuICAgICAgICBpZiAoY29va2llVHlwZSA9PT0gJ2FuYWx5dGljcycgJiYgb3B0aW9uc1tjb29raWVUeXBlXSkge1xyXG4gICAgICAgICAgICAvLyBFbmFibGUgR0EgaWYgYWxsb3dlZFxyXG4gICAgICAgICAgICB3aW5kb3dbJ2dhLWRpc2FibGUtJyArIFRSQUNLSU5HX0xJVkVfSURdID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBBbmFseXRpY3MoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBEaXNhYmxlIEdBIGlmIG5vdCBhbGxvd2VkXHJcbiAgICAgICAgICAgIHdpbmRvd1snZ2EtZGlzYWJsZS0nICsgVFJBQ0tJTkdfTElWRV9JRF0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFvcHRpb25zW2Nvb2tpZVR5cGVdKSB7XHJcbiAgICAgICAgICAgIC8vIEZldGNoIHRoZSBjb29raWVzIGluIHRoYXQgY2F0ZWdvcnlcclxuICAgICAgICAgICAgdmFyIGNvb2tpZXNJbkNhdGVnb3J5ID0gQ09PS0lFX0NBVEVHT1JJRVNbY29va2llVHlwZV1cclxuXHJcbiAgICAgICAgICAgIGNvb2tpZXNJbkNhdGVnb3J5LmZvckVhY2goZnVuY3Rpb24oY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgY29va2llXHJcbiAgICAgICAgICAgICAgICBDb29raWUoY29va2llLCBudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1c2VyQWxsb3dzQ29va2llQ2F0ZWdvcnkoY29va2llQ2F0ZWdvcnksIGNvb2tpZVByZWZlcmVuY2VzKSB7XHJcbiAgICAvLyBFc3NlbnRpYWwgY29va2llcyBhcmUgYWx3YXlzIGFsbG93ZWRcclxuICAgIGlmIChjb29raWVDYXRlZ29yeSA9PT0gJ2Vzc2VudGlhbCcpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTb21ldGltZXMgY29va2llUHJlZmVyZW5jZXMgaXMgbWFsZm9ybWVkIGluIHNvbWUgb2YgdGhlIHRlc3RzLCBzbyB3ZSBuZWVkIHRvIGhhbmRsZSB0aGVzZVxyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gY29va2llUHJlZmVyZW5jZXNbY29va2llQ2F0ZWdvcnldO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1c2VyQWxsb3dzQ29va2llKGNvb2tpZU5hbWUpIHtcclxuICAgIC8vIEFsd2F5cyBhbGxvdyBzZXR0aW5nIHRoZSBjb25zZW50IGNvb2tpZVxyXG4gICAgaWYgKGNvb2tpZU5hbWUgPT09IENPTlNFTlRfQ09PS0lFX05BTUUpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgdGhlIGN1cnJlbnQgY29va2llIHByZWZlcmVuY2VzXHJcbiAgICB2YXIgY29va2llUHJlZmVyZW5jZXMgPSBnZXRDb25zZW50Q29va2llKCk7XHJcblxyXG4gICAgLy8gSWYgbm8gcHJlZmVyZW5jZXMgb3Igb2xkIHZlcnNpb24gdXNlIHRoZSBkZWZhdWx0XHJcbiAgICBpZiAoIWlzVmFsaWRDb25zZW50Q29va2llKGNvb2tpZVByZWZlcmVuY2VzKSkge1xyXG4gICAgICAgIGNvb2tpZVByZWZlcmVuY2VzID0gREVGQVVMVF9DT09LSUVfQ09OU0VOVDtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBjYXRlZ29yeSBpbiBDT09LSUVfQ0FURUdPUklFUykge1xyXG4gICAgICAgIHZhciBjb29raWVzSW5DYXRlZ29yeSA9IENPT0tJRV9DQVRFR09SSUVTW2NhdGVnb3J5XTtcclxuXHJcbiAgICAgICAgaWYgKGNvb2tpZXNJbkNhdGVnb3J5LmluZGV4T2YoY29va2llTmFtZSkgIT09ICctMScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXJBbGxvd3NDb29raWVDYXRlZ29yeShjYXRlZ29yeSwgY29va2llUHJlZmVyZW5jZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBEZW55IHRoZSBjb29raWUgaWYgaXQgaXMgbm90IGtub3duIHRvIHVzXHJcbiAgICByZXR1cm4gZmFsc2VcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcclxuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xyXG4gICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb29raWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV07XHJcbiAgICAgICAgd2hpbGUgKGNvb2tpZS5jaGFyQXQoMCkgPT09ICcgJykge1xyXG4gICAgICAgICAgICBjb29raWUgPSBjb29raWUuc3Vic3RyaW5nKDEsIGNvb2tpZS5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29va2llLmluZGV4T2YobmFtZUVRKSA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vLyBkbyB3ZSBuZWVkIHRvIHNldCB0aGUgZG9tYWluP1xyXG5mdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgIGlmICh1c2VyQWxsb3dzQ29va2llKG5hbWUpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBvcHRpb25zID0ge31cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvb2tpZVN0cmluZyA9IG5hbWUgKyAnPScgKyB2YWx1ZSArICc7IHBhdGg9LzsgU2FtZVNpdGU9U3RyaWN0JztcclxuICAgICAgICBpZiAob3B0aW9ucy5kYXlzKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKG9wdGlvbnMuZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcclxuICAgICAgICAgICAgY29va2llU3RyaW5nID0gY29va2llU3RyaW5nICsgJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonKSB7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyA9IGNvb2tpZVN0cmluZyArICc7IFNlY3VyZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZVN0cmluZztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVsZXRlQ29va2llKG5hbWUpIHtcclxuICAgIGlmIChDb29raWUobmFtZSkpIHtcclxuICAgICAgICAvLyBDb29raWVzIG5lZWQgdG8gYmUgZGVsZXRlZCBpbiB0aGUgc2FtZSBsZXZlbCBvZiBzcGVjaWZpY2l0eSBpbiB3aGljaCB0aGV5IHdlcmUgc2V0XHJcbiAgICAgICAgLy8gSWYgYSBjb29raWUgd2FzIHNldCB3aXRoIGEgc3BlY2lmaWVkIGRvbWFpbiwgaXQgbmVlZHMgdG8gYmUgc3BlY2lmaWVkIHdoZW4gZGVsZXRlZFxyXG4gICAgICAgIC8vIElmIGEgY29va2llIHdhc24ndCBzZXQgd2l0aCB0aGUgZG9tYWluIGF0dHJpYnV0ZSwgaXQgc2hvdWxkbid0IGJlIHRoZXJlIHdoZW4gZGVsZXRlZFxyXG4gICAgICAgIC8vIFlvdSBjYW4ndCB0ZWxsIGlmIGEgY29va2llIHdhcyBzZXQgd2l0aCBhIGRvbWFpbiBhdHRyaWJ1dGUgb3Igbm90LCBzbyB0cnkgYm90aCBvcHRpb25zXHJcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9O2V4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVQ7cGF0aD0vJztcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz07ZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVDtkb21haW49JyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArICc7cGF0aD0vJztcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz07ZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVDtkb21haW49LicgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgKyAnO3BhdGg9Lyc7XHJcbiAgICB9XHJcbn0iXX0=
