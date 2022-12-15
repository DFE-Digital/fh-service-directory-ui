"use strict";
//todo: incorporate nonce support to this from fts
Object.defineProperty(exports, "__esModule", { value: true });
function loadAnalytics() {
    if (!window.ga || !window.ga.loaded) {
        // Load gtm script
        // Script based on snippet at https://developers.google.com/tag-manager/quickstart
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                'event': 'gtm.js'
            });
            var j = d.createElement(s);
            var dl = l !== 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            document.head.appendChild(j);
        })(window, document, 'script', 'dataLayer', 'GTM-53XG2JT');
    }
}
exports.default = loadAnalytics;
//# sourceMappingURL=analytics.js.map