using System.Globalization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text;

namespace FamilyHubs.ServiceDirectory.Web.Pages.Cookies;

//todo: show success banner when set with no js

public static class RawCookieExtensions
{
    /// <summary>
    /// Add a new cookie without HTML form URL encoding the value (as Response.Cookies.Append insists on).
    /// Only tested for Path, SameSite, Expires and Secure options.
    /// If there's an issue with any of the other options, take it up with chatgpt ;-)
    /// </summary>
    public static void AppendRawCookieDough(this HttpResponse response, string key, string value, CookieOptions? options = null)
    {
        if (options == null)
        {
            response.Headers.Append("Set-Cookie", key + "=" + value + "; path=/");
            return;
        }

        var cookieValue = new StringBuilder($"{key}={value}");

        if (options.Expires.HasValue)
        {
            cookieValue.Append($"; Expires={options.Expires.Value.ToString("R")}");
        }

        if (!string.IsNullOrEmpty(options.Path))
        {
            cookieValue.Append($"; Path={options.Path}");
        }

        if (!string.IsNullOrEmpty(options.Domain))
        {
            cookieValue.Append($"; Domain={options.Domain}");
        }

        if (options.Secure)
        {
            cookieValue.Append("; Secure");
        }

        if (options.HttpOnly)
        {
            cookieValue.Append("; HttpOnly");
        }

        if (options.SameSite != SameSiteMode.Unspecified)
        {
            cookieValue.Append($"; SameSite={options.SameSite.ToString().ToLowerInvariant()}");
        }

        response.Headers.Add("Set-Cookie", cookieValue.ToString());
    }
}

public class IndexModel : PageModel
{
    // GDS says (Option 3) If you set non-essential cookies, but only on the client
    // You can choose to make your banner only work with JavaScript
    // Does that hold for the cookie page too?
    // probably not, the cookie page is probably the fallback to get the banner removed if the user doesn't have js
    // https://design-system.service.gov.uk/components/cookie-banner/
    public void OnPost(bool analytics)
    {
        SetConsentCookie(analytics);
        ResetCookies();
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

        Response.AppendRawCookieDough(CONSENT_COOKIE_NAME,
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