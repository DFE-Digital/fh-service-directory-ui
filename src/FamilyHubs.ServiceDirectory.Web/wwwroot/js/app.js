const CONSENT_COOKIE_NAME="service_directory_cookies_policy",COOKIE_CATEGORIES={analytics:["_ga","_ga_"+window.GA_CONTAINER_ID],essential:["service_directory_cookies_policy"]},DEFAULT_COOKIE_CONSENT={analytics:!1,version:window.GDS_CONSENT_COOKIE_VERSION};function getConsentCookie(){const e=getCookie(CONSENT_COOKIE_NAME);let t;if(!e)return null;try{t=JSON.parse(e)}catch(e){return null}return t}function isValidConsentCookie(e){return e&&e.version>=window.GDS_CONSENT_COOKIE_VERSION}function setConsentCookie(e){let t=getConsentCookie();for(var o in t||(t=JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT))),e)t[o]=e[o];delete t.essential,t.version=window.GDS_CONSENT_COOKIE_VERSION,setCookie(CONSENT_COOKIE_NAME,JSON.stringify(t),{days:365}),resetCookies()}function resetCookies(){var e=getConsentCookie();for(var t in isValidConsentCookie(e)||(e=JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT))),e){if("version"!==t)if("essential"!==t)if(!e[t])COOKIE_CATEGORIES[t].forEach((function(e){deleteCookie(e)}))}}function userAllowsCookieCategory(e,t){if("essential"===e)return!0;try{return t[e]}catch(e){return console.error(e),!1}}function userAllowsCookie(e){if(e===CONSENT_COOKIE_NAME)return!0;var t=getConsentCookie();for(var o in isValidConsentCookie(t)||(t=DEFAULT_COOKIE_CONSENT),COOKIE_CATEGORIES){if("-1"!==COOKIE_CATEGORIES[o].indexOf(e))return userAllowsCookieCategory(o,t)}return!1}function getCookie(e){for(var t=e+"=",o=document.cookie.split(";"),i=0,n=o.length;i<n;i++){for(var s=o[i];" "===s.charAt(0);)s=s.substring(1,s.length);if(0===s.indexOf(t))return decodeURIComponent(s.substring(t.length))}return null}function setCookie(e,t,o){if(userAllowsCookie(e)){void 0===o&&(o={});var i=e+"="+t+"; path=/; SameSite=Strict";if(o.days){var n=new Date;n.setTime(n.getTime()+24*o.days*60*60*1e3),i=i+"; expires="+n.toUTCString()}"https:"===document.location.protocol&&(i+="; Secure"),document.cookie=i}}function deleteCookie(e){getCookie(e)&&(document.cookie=e+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/",document.cookie=e+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain="+window.location.hostname+";path=/",document.cookie=e+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=."+window.location.hostname+";path=/")}function nodeListForEach(e,t){if(window.NodeList.prototype.forEach)return e.forEach(t);for(var o=0;o<e.length;o++)t.call(window,e[o],o,e)}function gtag(e,...t){window.dataLayer=window.dataLayer||[],window.dataLayer.push(arguments)}let GaMeasurementId="";function initAnalytics(e){if(!Boolean(e))return;GaMeasurementId=e,setDefaultConsent(),loadGaScript(e),gtag("js",new Date);const t=getPiiSafePageView(e);gtag("config",e,{send_page_view:!1,page_path:t.page_path,page_location:t.page_location,page_referrer:t.referrer,cookie_flags:"secure"});const o=getConsentCookie();o&&isValidConsentCookie(o)&&o.analytics&&updateAnalyticsStorageConsent(!0),sendPageViewEvent(),sendFilterPageCustomEvent()}function setDefaultConsent(){gtag("consent","default",{analytics_storage:"denied"}),gtag("set","url_passthrough",!0)}function updateAnalyticsStorageConsent(e,t){let o={analytics_storage:e?"granted":"denied"};void 0!==t&&(o.wait_for_update=t),gtag("consent","update",o)}function sendPageViewEvent(){gtag("event","page_view",getPiiSafePageView(GaMeasurementId))}function sendFilterPageCustomEvent(){const e=document.getElementById("results"),t=null==e?void 0:e.getAttribute("data-total-results");void 0!==t&&gtag("event","filter_page",{total_results:t})}function sendAnalyticsCustomEvent(e,t){gtag("event","analytics",{accepted:e,source:t})}function loadGaScript(e){const t=document.getElementsByTagName("script")[0],o=document.createElement("script");o.async=!0,o.src="https://www.googletagmanager.com/gtag/js?id="+e,t.parentNode.insertBefore(o,t)}function getPiiSafePageView(e){const t={page_title:document.title,send_to:e,referrer:"",page_location:"",page_path:""};if(""!==document.referrer){const e=getPiiSafeQueryString(new URL(document.referrer).search);if(null==e)t.referrer=document.referrer;else{const o=document.referrer.split("?");t.referrer=o[0]+e}}const o=getPiiSafeQueryString(window.location.search);if(null==o)return t.page_location=window.location.href,t.page_path=window.location.pathname+window.location.search,t;const i=window.location.href.split("?");return t.page_location=i[0]+o,t.page_path=window.location.pathname+o,t}function getPiiSafeQueryString(e){const t=new URLSearchParams(e);let o=t.get("postcode");return null==o?null:(o=o.replace(/[a-zA-Z]+$/,""),t.set("postcode",o),t.delete("latitude"),t.delete("longitude"),"?"+t.toString())}const cookieBannerAcceptSelector=".js-cookie-banner-accept",cookieBannerRejectSelector=".js-cookie-banner-reject",cookieBannerHideButtonSelector=".js-cookie-banner-hide",cookieMessageSelector=".js-cookie-banner-message",cookieConfirmationAcceptSelector=".js-cookie-banner-confirmation-accept",cookieConfirmationRejectSelector=".js-cookie-banner-confirmation-reject";function CookieBanner(e){this.$module=e}function CookiesPage(e){this.$module=e}CookieBanner.prototype.init=function(){if(this.$cookieBanner=this.$module,this.$acceptButton=this.$module.querySelector(".js-cookie-banner-accept"),this.$rejectButton=this.$module.querySelector(".js-cookie-banner-reject"),this.$cookieMessage=this.$module.querySelector(cookieMessageSelector),this.$cookieConfirmationAccept=this.$module.querySelector(cookieConfirmationAcceptSelector),this.$cookieConfirmationReject=this.$module.querySelector(cookieConfirmationRejectSelector),this.$cookieBannerHideButtons=this.$module.querySelectorAll(".js-cookie-banner-hide"),this.$cookieBanner&&!this.onCookiesPage()){var e=getConsentCookie();e&&isValidConsentCookie(e)||(resetCookies(),this.$cookieBanner.removeAttribute("hidden")),this.$acceptButton.addEventListener("click",this.acceptCookies.bind(this)),this.$rejectButton.addEventListener("click",this.rejectCookies.bind(this)),nodeListForEach(this.$cookieBannerHideButtons,function(e){e.addEventListener("click",this.hideBanner.bind(this))}.bind(this))}},CookieBanner.prototype.hideBanner=function(){this.$cookieBanner.setAttribute("hidden",!0)},CookieBanner.prototype.acceptCookies=function(){setConsentCookie({analytics:!0}),updateAnalyticsStorageConsent(!0),sendAnalyticsCustomEvent(!0,"banner"),sendPageViewEvent(),sendFilterPageCustomEvent(),this.$cookieMessage.setAttribute("hidden",!0),this.revealConfirmationMessage(this.$cookieConfirmationAccept)},CookieBanner.prototype.rejectCookies=function(){updateAnalyticsStorageConsent(!0),sendAnalyticsCustomEvent(!1,"banner"),updateAnalyticsStorageConsent(!1),setConsentCookie({analytics:!1}),this.$cookieMessage.setAttribute("hidden",!0),this.revealConfirmationMessage(this.$cookieConfirmationReject)},CookieBanner.prototype.revealConfirmationMessage=function(e){e.removeAttribute("hidden"),e.getAttribute("tabindex")||(e.setAttribute("tabindex","-1"),e.addEventListener("blur",(function(){e.removeAttribute("tabindex")}))),e.focus()},CookieBanner.prototype.onCookiesPage=function(){return"/cookies/"===window.location.pathname},CookiesPage.prototype.init=function(){this.$cookiePage=this.$module,this.$cookiePage&&(this.$cookieForm=this.$cookiePage.querySelector(".js-cookies-page-form"),this.$cookieFormFieldsets=this.$cookieForm.querySelectorAll(".js-cookies-page-form-fieldset"),this.$successNotification=this.$cookiePage.querySelector(".js-cookies-page-success"),this.$successLink=this.$cookiePage.querySelector(".js-cookies-page-success-link"),nodeListForEach(this.$cookieFormFieldsets,function(e){this.showUserPreference(e,getConsentCookie())}.bind(this)),this.$cookieForm.addEventListener("submit",this.savePreferences.bind(this)))},CookiesPage.prototype.savePreferences=function(e){e.preventDefault();var t={};nodeListForEach(this.$cookieFormFieldsets,function(e){var o=this.getCookieType(e),i=e.querySelector("input[name="+o+"]:checked").value;t[o]="true"===i}.bind(this)),updateAnalyticsStorageConsent(!0);const o=t.analytics;sendAnalyticsCustomEvent(o,"cookies"),o?sendPageViewEvent():updateAnalyticsStorageConsent(!1),setConsentCookie(t),document.querySelector('[data-module="govuk-cookie-banner"]').setAttribute("hidden","true"),this.showSuccessNotification()},CookiesPage.prototype.showUserPreference=function(e,t){var o=this.getCookieType(e),i=!1;o&&t&&void 0!==t[o]&&(i=t[o]);var n=i?"true":"false";e.querySelector("input[name="+o+"][value="+n+"]").checked=!0},CookiesPage.prototype.showSuccessNotification=function(){this.$successNotification.removeAttribute("hidden");var e=!!document.referrer&&new URL(document.referrer).pathname;e&&e!==document.location.pathname?(this.$successLink.href=e,this.$successLink.removeAttribute("hidden")):this.$successLink.setAttribute("hidden","true"),this.$successNotification.getAttribute("tabindex")||this.$successNotification.setAttribute("tabindex","-1"),this.$successNotification.focus(),window.scrollTo(0,0)},CookiesPage.prototype.getCookieType=function(e){return e.id};const $cookieBanner=document.querySelector('[data-module="govuk-cookie-banner"]');new CookieBanner($cookieBanner).init(),initAnalytics(window.GA_MEASUREMENT_ID);var $cookiesPage=document.querySelector('[data-module="app-cookies-page"]');new CookiesPage($cookiesPage).init();const backLinks=document.querySelectorAll(".app-back-link");nodeListForEach(backLinks,(e=>{e.addEventListener("click",(()=>{window.history.back()}))}));const button=document.getElementById("open-close-filters");null==button||button.addEventListener("click",(function(e){const t=document.getElementById("filters");"none"===t.style.display?t.style.display="block":t.style.display="none"}));
//# sourceMappingURL=app.js.map
