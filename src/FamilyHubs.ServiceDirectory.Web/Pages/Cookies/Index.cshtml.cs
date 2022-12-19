using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.Cookies;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.Cookies;

//todo: use post redirect get?

public class IndexModel : PageModel
{
    public bool ShowSuccessBanner { get; set; }

    // GDS says (Option 3) If you set non-essential cookies, but only on the client
    // You can choose to make your banner only work with JavaScript
    // Does that hold for the cookie page too?
    // probably not, the cookie page is probably the fallback to get the banner removed if the user doesn't have js
    // https://design-system.service.gov.uk/components/cookie-banner/
    public void OnPost(bool analytics)
    {
        SetConsentCookie(analytics);
        ResetCookies();
        ShowSuccessBanner = true;
    }

    // ideally, these would be part of a base model and passed through to _Layout.cshtml
    // but at least (for now) name them exactly the same as it is in the js, so a find search will find it
    // (so don't let Resharper rename then!)
    private const int GDS_CONSENT_COOKIE_VERSION = 1;
    private const string CONSENT_COOKIE_NAME = "service_directory_cookies_policy";

    /// <summary>
    /// Note: this needs to be compatible with our javascript cookie code, such as cookie-functions.js
    /// </summary>
    private void SetConsentCookie(bool analyticsAllowed)
    {
        var cookieOptions = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(365),
            Path = "/",
            SameSite = SameSiteMode.Strict
        };

        if (Request.IsHttps)
        {
            cookieOptions.Secure = true;
        }

        Response.AppendRawCookie(CONSENT_COOKIE_NAME,
            $$"""{"analytics": {{analyticsAllowed.ToString(CultureInfo.InvariantCulture).ToLowerInvariant()}}, "version": {{GDS_CONSENT_COOKIE_VERSION}}}""", cookieOptions);
    }

    /// <summary>
    /// Deletes any cookies the user has not consented to.
    /// </summary>
    private void ResetCookies()
    {
        //todo: GA_TODO delete ga cookies
        //analytics: ['_ga', '_gid', '_gat_UA-' + TRACKING_PREVIEW_ID, '_gat_UA-' + TRACKING_LIVE_ID],
    }
}