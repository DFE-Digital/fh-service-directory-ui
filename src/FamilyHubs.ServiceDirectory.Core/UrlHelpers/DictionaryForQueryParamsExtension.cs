
namespace FamilyHubs.ServiceDirectory.Core.UrlHelpers;

public static class DictionaryForQueryParamsExtension
{
    public static Dictionary<string, string?> AddOptionalQueryParams(this Dictionary<string, string?> queryParams, string key, object? value)
    {
        if (value != null)
        {
            queryParams.Add(key, value.ToString());
        }

        return queryParams;
    }
}