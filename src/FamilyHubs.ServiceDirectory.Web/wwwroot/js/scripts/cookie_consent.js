////todo: better to reuse this...
////https://github.com/alphagov/govuk-design-system/blob/main/src/javascripts/components/cookie-functions.js
//// or gurneys (or another esfa one?)..
////https://github.com/SkillsFundingAgency/dfc-discoverskillsandcareers/blob/master/src/Dfc.DiscoverSkillsAndCareers.WebApp/src/js/modules/cookieprefrences.js
//import $ = require("jquery");
//function setCookie(name, value, options) {
//    if (typeof options === 'undefined') {
//        options = {}
//    }
//    var cookieString = name + '=' + value + '; path=/;SameSite=None'
//    if (options.days) {
//        let date = new Date()
//        date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000))
//        cookieString = cookieString + '; expires=' + date.toUTCString()
//    }
//    if (!options.domain) {
//        options.domain = window.location.hostname;
//    }
//    if (document.location.protocol === 'https:') {
//        cookieString = cookieString + '; Secure'
//    }
//    document.cookie = cookieString + ';domain=' + options.domain
//}
//$(document).ready(function () {
//    if (window.GOVUK.cookie("AnalyticsConsent") == "true" || window.GOVUK.cookie("AnalyticsConsent") == "false") {
//        $("div.govuk-cookie-banner").hide();
//    } else {
//        $("button.cookie-consent-button").click(function () {
//            if ($(this).hasClass("cookies-accept")) {
//                setCookie("AnalyticsConsent", "true", { days: 365 });
//                setCookie("MarketingCookieConsent", "true", { days: 365 });
//                $("div#cookie-accept-message").show();
//            } else {
//                setCookie("AnalyticsConsent", "false", { days: 365 });
//                setCookie("MarketingCookieConsent", "false", { days: 365 });
//                $("div#cookie-reject-message").show();
//            }
//            $("div#cookie-message").hide();
//            window.scrollTo(0, 0);
//        });
//        $(".cookies-close").click(function () {
//            $("div.govuk-cookie-banner").hide();
//        });
//    }
//});
//# sourceMappingURL=cookie_consent.js.map