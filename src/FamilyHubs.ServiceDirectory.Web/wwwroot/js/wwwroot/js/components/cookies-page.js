"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_functions_js_1 = require("./cookie-functions.js");
var helpers_js_1 = require("./helpers.js");
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
    (0, helpers_js_1.nodeListForEach)(this.$cookieFormFieldsets, function ($cookieFormFieldset) {
        this.showUserPreference($cookieFormFieldset, (0, cookie_functions_js_1.getConsentCookie)());
        $cookieFormFieldset.removeAttribute('hidden');
    }.bind(this));
    // Show submit button
    this.$cookieForm.querySelector('.js-cookies-form-button').removeAttribute('hidden');
    this.$cookieForm.addEventListener('submit', this.savePreferences.bind(this));
};
CookiesPage.prototype.savePreferences = function (event) {
    // Stop default form submission behaviour
    event.preventDefault();
    var preferences = {};
    (0, helpers_js_1.nodeListForEach)(this.$cookieFormFieldsets, function ($cookieFormFieldset) {
        var cookieType = this.getCookieType($cookieFormFieldset);
        var selectedItem = $cookieFormFieldset.querySelector('input[name=' + cookieType + ']:checked').value;
        preferences[cookieType] = selectedItem === 'yes';
    }.bind(this));
    // Save preferences to cookie and show success notification
    (0, cookie_functions_js_1.setConsentCookie)(preferences);
    this.showSuccessNotification();
};
CookiesPage.prototype.showUserPreference = function ($cookieFormFieldset, preferences) {
    var cookieType = this.getCookieType($cookieFormFieldset);
    var preference = false;
    if (cookieType && preferences && preferences[cookieType] !== undefined) {
        preference = preferences[cookieType];
    }
    var radioValue = preference ? 'yes' : 'no';
    var radio = $cookieFormFieldset.querySelector('input[name=' + cookieType + '][value=' + radioValue + ']');
    radio.checked = true;
};
CookiesPage.prototype.showSuccessNotification = function () {
    this.$successNotification.removeAttribute('hidden');
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
exports.default = CookiesPage;
//# sourceMappingURL=cookies-page.js.map