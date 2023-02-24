import { getConsentCookie, setConsentCookie, ConsentCookie } from './cookie-functions'
import { nodeListForEach } from './helpers'
import { sendPageViewEvent, sendAnalyticsCustomEvent, updateAnalyticsStorageConsent } from './analytics'

function CookiesPage($module) {
    this.$module = $module
}

CookiesPage.prototype.init = function () {
    this.$cookiePage = this.$module

    if (!this.$cookiePage) {
        return
    }

    this.$cookieForm = this.$cookiePage.querySelector('.js-cookies-page-form')
    this.$cookieFormFieldsets = this.$cookieForm.querySelectorAll('.js-cookies-page-form-fieldset')
    this.$successNotification = this.$cookiePage.querySelector('.js-cookies-page-success')
    this.$successLink = this.$cookiePage.querySelector('.js-cookies-page-success-link')

    nodeListForEach(this.$cookieFormFieldsets, function ($cookieFormFieldset) {
        this.showUserPreference($cookieFormFieldset, getConsentCookie())
/*        $cookieFormFieldset.removeAttribute('hidden')*/
    }.bind(this))

    // Show submit button
    //this.$cookieForm.querySelector('.js-cookies-form-button').removeAttribute('hidden')

    this.$cookieForm.addEventListener('submit', this.savePreferences.bind(this))
}

CookiesPage.prototype.savePreferences = function (event) {
    // Stop default form submission behaviour
    event.preventDefault();

    var preferences: ConsentCookie = {}

    nodeListForEach(this.$cookieFormFieldsets,
        function($cookieFormFieldset) {
            var cookieType = this.getCookieType($cookieFormFieldset)
            var selectedItem = $cookieFormFieldset.querySelector('input[name=' + cookieType + ']:checked').value

            preferences[cookieType] = selectedItem === 'true'
        }.bind(this));

    updateAnalyticsStorageConsent(true);
    const analyticsAccepted = preferences['analytics'];
    sendAnalyticsCustomEvent(analyticsAccepted, 'cookies');

    if (analyticsAccepted) {
        sendPageViewEvent();
    } else {
        updateAnalyticsStorageConsent(false);
    }

    setConsentCookie(preferences);

    // handle the corner case, where the user has selected their preference on the cookie page, whilst the banner is still open as they haven't previously selected their preference
    //todo: call hideBanner
    var banner = document.querySelector('[data-module="govuk-cookie-banner"]');
    banner.setAttribute('hidden', 'true');
    
    this.showSuccessNotification()
}

CookiesPage.prototype.showUserPreference = function ($cookieFormFieldset, preferences) {
    var cookieType = this.getCookieType($cookieFormFieldset)
    var preference = false

    if (cookieType && preferences && preferences[cookieType] !== undefined) {
        preference = preferences[cookieType]
    }

    var radioValue = preference ? 'true' : 'false'
    var radio = $cookieFormFieldset.querySelector('input[name=' + cookieType + '][value=' + radioValue + ']')
    radio.checked = true
}

CookiesPage.prototype.showSuccessNotification = function () {
    this.$successNotification.removeAttribute('hidden')

    // if the user's come to the cookies page through the link in the cookie banner, show a link to take them back to the page they came from
    var referrer = document.referrer ? new URL(document.referrer).pathname : false;
    if (referrer && referrer !== document.location.pathname) {
        this.$successLink.href = referrer;
        this.$successLink.removeAttribute('hidden')
    } else {
        this.$successLink.setAttribute('hidden', 'true');
    }

    // Set tabindex to -1 to make the element focusable with JavaScript.
    // GOV.UK Frontend will remove the tabindex on blur as the component doesn't
    // need to be focusable after the user has read the text.
    if (!this.$successNotification.getAttribute('tabindex')) {
        this.$successNotification.setAttribute('tabindex', '-1')
    }

    this.$successNotification.focus()

    // scroll to the top of the page
    window.scrollTo(0, 0)
}

CookiesPage.prototype.getCookieType = function ($cookieFormFieldset) {
    return $cookieFormFieldset.id
}

export default CookiesPage