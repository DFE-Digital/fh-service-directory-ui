// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck
export default function loadAnalytics() {
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
//# sourceMappingURL=analytics.js.map