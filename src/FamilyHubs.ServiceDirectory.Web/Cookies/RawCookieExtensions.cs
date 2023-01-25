using System.Text;

namespace FamilyHubs.ServiceDirectory.Web.Cookies;

public static class RawCookieExtensions
{
    /// <summary>
    /// Add a new cookie without HTML form URL encoding the value (as Response.Cookies.Append insists on).
    /// Only tested for Path, SameSite, Expires and Secure options.
    /// If there's an issue with any of the other options, take it up with chatgpt ;-)
    /// </summary>
    public static void AppendRawCookie(this HttpResponse response, string key, string value, CookieOptions? options = null)
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