//todo: GA_TODO incorporate nonce support to this from fts
export default function loadAnalytics() {
    // no-op until we add ga later
    //@* https://dev.to/matijamrkaic/using-google-tag-manager-with-a-content-security-policy-9ai*@
    //<script id="gtmScript" data-nonce="@Context.GetNonce()" asp-add-nonce>
    //    (function (w, d, s, l, i){w[l] = w[l] || [];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    //    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
    //    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;var n=d.querySelector('[nonce]');n&&j.setAttribute('nonce',n.nonce||n.getAttribute('nonce'));
    //      f.parentNode.insertBefore(j,f);})(window, document, 'script', 'dataLayer', 'GTM-PLHRMLT');
    //</script>
    //if (!window.ga || !window.ga.loaded) {
    //    // Load gtm script
    //    // Script based on snippet at https://developers.google.com/tag-manager/quickstart
    //    (function (w, d, s, l, i) {
    //        w[l] = w[l] || []
    //        w[l].push({
    //            'gtm.start': new Date().getTime(),
    //            'event': 'gtm.js'
    //        })
    //        var j = d.createElement(s)
    //        var dl = l !== 'dataLayer' ? '&l=' + l : ''
    //        j.async = true
    //        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
    //        document.head.appendChild(j)
    //    })(window, document, 'script', 'dataLayer', 'GTM-53XG2JT')
    //}
}
//# sourceMappingURL=analytics.js.map