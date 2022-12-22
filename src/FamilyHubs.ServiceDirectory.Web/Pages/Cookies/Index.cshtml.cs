using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.Cookies;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.Cookies;

//todo: delete _ga_ cookie in javascript
//todo: link in success banner
//todo: use post redirect get?

public class IndexModel : PageModel
{
#pragma warning disable
    // private const string GtmContainerId = "GTM-W6QMSGQ";

    // ideally, these would be part of a base model and passed through to _Layout.cshtml
    // but at least (for now) name them exactly the same as it is in the js, so a find search will find it
    // (so don't let Resharper rename then!)
    private const int GDS_CONSENT_COOKIE_VERSION = 1;
    private const string CONSENT_COOKIE_NAME = "service_directory_cookies_policy";

    public bool ShowSuccessBanner { get; set; }
    public string? LastPage { get; set; }

    public void OnPost(bool analytics)
    {
        SetConsentCookie(analytics);
        if (!analytics)
        {
            ResetAnalyticCookies();
        }

        //System.Diagnostics.Debugger.Break();
        ShowSuccessBanner = true;
        //var refererUri = new Uri(Request.Headers.Referer);
        LastPage = Request.Headers.Referer;
    }

    /// <summary>
    /// Note: this needs to be compatible with our javascript cookie code, such as cookie-functions.js
    /// </summary>
    private void SetConsentCookie(bool analyticsAllowed)
    {
        //todo: Response.Cookies has a static EnableCookieNameEncoding - can we use that and switch to Append??
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

    private void ResetAnalyticCookies()
    {
        foreach (var uaCookie in Request.Cookies.Where(c => c.Key.StartsWith("_ga")))
        {
            DeleteCookies(uaCookie.Key);
        }

        DeleteCookies("_gid");
    }

    /// <summary>
    /// Asks the browser to deletes the supplied cookies.
    /// </summary>
    private void DeleteCookies(params string[] cookies)
    {
        foreach (var cookie in cookies)
        {
            //todo: cookieoptions for domain?
            Response.Cookies.Delete(cookie);
        }
    }
}