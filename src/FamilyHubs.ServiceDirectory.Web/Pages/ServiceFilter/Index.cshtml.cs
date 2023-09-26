using System.Dynamic;
using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Content;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
using FamilyHubs.SharedKernel.Razor.Pagination;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Primitives;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public class ServiceFilterModel : PageModel
{
    // simpler than asking all the filters to remove themselves
    private static HashSet<string> _parametersWhitelist = new()
    {
        "postcode",
        "adminarea",
        "latitude",
        "longitude",
    };

    public IEnumerable<IFilter> Filters { get; set; } = null!;
    public string? Postcode { get; set; }
    public string? AdminArea { get; set; }
    public float? Latitude { get; set; }
    public float? Longitude { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }
    public bool FromPostcodeSearch { get; set; }
    public int CurrentPage { get; set; }
    public IPagination Pagination { get; set; }
    public int TotalResults { get; set; }

    private readonly IServiceDirectoryClient _serviceDirectoryClient;
    private readonly IPostcodeLookup _postcodeLookup;
    private readonly IPageFilterFactory _pageFilterFactory;
    private const int PageSize = 10;

    public ServiceFilterModel(
        IServiceDirectoryClient serviceDirectoryClient,
        IPostcodeLookup postcodeLookup,
        IPageFilterFactory pageFilterFactory)
    {
        _serviceDirectoryClient = serviceDirectoryClient;
        _postcodeLookup = postcodeLookup;
        _pageFilterFactory = pageFilterFactory;
        Services = Enumerable.Empty<Service>();
        OnlyShowOneFamilyHubAndHighlightIt = false;
        Pagination = new DontShowPagination();
    }

    public async Task<IActionResult> OnPost(string? postcode, string? adminArea)
    {
        dynamic routeValues;

        if (adminArea == null)
        {
            var (postcodeError, postcodeInfo) = await _postcodeLookup.Get(postcode);
            if (postcodeError != PostcodeError.None)
            {
                return RedirectToPage("/PostcodeSearch/Index", new { postcodeError });
            }

            routeValues = GetFromPostcodeSearchRouteValues(postcodeInfo!);
        }
        else
        {
            var remove = GetRemove(Request.Form);

            // remove key/values we don't want to keep
            var filteredForm = Request.Form
                .Where(kvp => KeepParam(kvp.Key, remove.Key))
                .ToList();

            //todo: hacky: ask optional filters (or all filters), to manipulate form
            if (filteredForm.TrueForAll(kvp => kvp.Key != "children_and_young-option-selected"))
            {
                filteredForm = filteredForm.Where(keyValuePair => keyValuePair.Key != "children_and_young").ToList();
            }

            if (remove.Value != null)
            {
                // remove values we don't want to keep
                filteredForm = filteredForm.Select(kvp => RemoveFilterValue(kvp, remove)).ToList();
            }

            routeValues = ToRouteValues(filteredForm);
        }

        return RedirectToPage("/ServiceFilter/Index", routeValues);
    }

    private static dynamic GetFromPostcodeSearchRouteValues(IPostcodeInfo postcodeInfo)
    {
        dynamic routeValues = new
        {
            postcode = postcodeInfo.Postcode,
            adminarea = postcodeInfo.AdminArea,
            latitude = postcodeInfo.Latitude,
            longitude = postcodeInfo.Longitude,
            frompostcodesearch = true
        };
        return routeValues;
    }

    private static dynamic ToRouteValues(IEnumerable<KeyValuePair<string, StringValues>> values)
    {
        dynamic routeValues = new ExpandoObject();
        var routeValuesDictionary = (IDictionary<string, object>)routeValues;

        foreach (var keyValuePair in values)
        {
            // ToString() stops RedirectToPage() using key=foo&key=bar, and instead we get key=foo,bar which we unpick on the GET
            routeValuesDictionary[keyValuePair.Key] = keyValuePair.Value.ToString();
        }

        return routeValues;
    }

    private static KeyValuePair<string?, string?> GetRemove(IFormCollection form)
    {
        string? remove = form[IFilter.RemoveKey];
        switch (remove)
        {
            case null:
                return default;
            case IFilter.RemoveAllValue:
                return new KeyValuePair<string?, string?>(IFilter.RemoveAllValue, null);
        }

        int filterNameEndPos = remove.IndexOf("--", StringComparison.Ordinal);
        if (filterNameEndPos == -1)
            return default;

        return new KeyValuePair<string?, string?>(remove[..filterNameEndPos], remove[(filterNameEndPos + 2)..]);
    }

    private static KeyValuePair<string, StringValues> RemoveFilterValue(KeyValuePair<string, StringValues> kvp, KeyValuePair<string?, string?> remove)
    {
        if (kvp.Key != remove.Key)
            return kvp;

        var values = kvp.Value.ToList();
        values.Remove(remove.Value);
        return new KeyValuePair<string, StringValues>(kvp.Key, new StringValues(values.ToArray()));
    }

    private static bool KeepParam(string key, string? removeKey)
    {
        if (key is "__RequestVerificationToken" or IFilter.RemoveKey)
            return false;

        if (removeKey == null)
            return true;

        //todo: move this logic out of here?
        if (removeKey == IFilter.RemoveAllValue)
        {
            return _parametersWhitelist.Contains(key.ToLowerInvariant());
        }

        // if we're removing a filter, go back to page 1
        if (key == QueryParamKeys.PageNum)
            return false;

        //todo: we don't want knowledge of the internals of the optional filter here
        if (key.EndsWith("-option-selected") && key.StartsWith(removeKey))
            return false;

        // keep, but we might remove the only value later
        return true;
    }

    public Task<IActionResult> OnGet(string? postcode, string? adminArea, float? latitude, float? longitude, int? pageNum, bool? fromPostcodeSearch)
    {
        if (AnyParametersMissing(postcode, adminArea, latitude, longitude))
        {
            // handle cases:
            // * when user goes filter page => cookie page => back link from success banner
            // * user manually removes query parameters from url
            // * user goes directly to page by typing it into the address bar
            return Task.FromResult<IActionResult>(RedirectToPage("/PostcodeSearch/Index"));
        }

        return HandleGet(postcode!, adminArea!, latitude!.Value, longitude!.Value, pageNum, fromPostcodeSearch);
    }

    private static bool AnyParametersMissing(string? postcode, string? adminArea, float? latitude, float? longitude)
    {
        return string.IsNullOrEmpty(postcode)
               || string.IsNullOrEmpty(adminArea)
               || latitude == null
               || longitude == null;
    }

    private async Task<IActionResult> HandleGet(string postcode, string adminArea, float latitude, float longitude, int? pageNum, bool? fromPostcodeSearch)
    {
        FromPostcodeSearch = fromPostcodeSearch == true;
        Postcode = postcode;
        AdminArea = adminArea;
        Latitude = latitude;
        Longitude = longitude;
        CurrentPage = pageNum ?? 1;

        // before each page load we need to initialise default filter options
        Filters = await _pageFilterFactory.GetDefaultFilters();

        // if we got here from PostCode search, then just used above Default filters else apply the filters from the query parameters
        if (!FromPostcodeSearch)
        {
            Filters = Filters.Select(fd => fd.Apply(Request.Query));
        }

        (Services, Pagination) = await GetServicesAndPagination(adminArea, latitude, longitude);

        return Page();
    }

    private async Task<(IEnumerable<Service>, IPagination)> GetServicesAndPagination(string adminArea, float latitude, float longitude)
    {
        var serviceParams = new ServicesParams(adminArea, latitude, longitude)
        {
            PageNumber = CurrentPage,
            PageSize = PageSize
        };

        foreach (var filter in Filters)
        {
            filter.AddFilterCriteria(serviceParams);
        }

        OnlyShowOneFamilyHubAndHighlightIt = serviceParams.MaxFamilyHubs is 1;

        var services = await _serviceDirectoryClient.GetServices(serviceParams);

        var pagination = new LargeSetPagination(services.TotalPages, CurrentPage);

        TotalResults = services.TotalCount;

        return (ServiceMapper.ToViewModel(services.Items), pagination);
    }
}