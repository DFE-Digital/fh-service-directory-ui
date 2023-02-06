using System.Diagnostics.CodeAnalysis;
using System.Dynamic;
using FamilyHubs.ServiceDirectory.Core.Pagination;
using FamilyHubs.ServiceDirectory.Core.Pagination.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Content;
using FamilyHubs.ServiceDirectory.Web.Filtering.Filters;
using FamilyHubs.ServiceDirectory.Web.Filtering;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Primitives;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public class ServiceFilterModel : PageModel
{
    private static readonly FilterSubGroups DefaultCategoryFilter = new CategoryFilter();

    public static readonly IEnumerable<IFilter> DefaultFilters = new IFilter[]
    {
        new CostFilter(),
        new ShowFilter(),
        new SearchWithinFilter(),
        new ChildrenAndYoungPeopleFilter()
    };

    public IEnumerable<IFilter> Filters { get; set; }
    //todo: into Filters (above)
    public IFilterSubGroups CategoryFilter { get; set; }
    public string? Postcode { get; set; }
    public string? AdminArea { get; set; }
    public float? Latitude { get; set; }
    public float? Longitude { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }
    public bool FromPostcodeSearch { get; set; }
    public int CurrentPage { get; set; }
    public IPagination Pagination { get; set; }

    private readonly IServiceDirectoryClient _serviceDirectoryClient;
    private readonly IPostcodeLookup _postcodeLookup;
    private const int PageSize = 10;

    public ServiceFilterModel(IServiceDirectoryClient serviceDirectoryClient, IPostcodeLookup postcodeLookup)
    {
        _serviceDirectoryClient = serviceDirectoryClient;
        _postcodeLookup = postcodeLookup;
        Filters = DefaultFilters;
        CategoryFilter = DefaultCategoryFilter;
        Services = Enumerable.Empty<Service>();
        OnlyShowOneFamilyHubAndHighlightIt = false;
        Pagination = new DontShowPagination();
    }

    public Task<IActionResult> OnPost(string? postcode, string? adminArea)
    {
        CheckParameters(postcode);

        return HandlePost(postcode, adminArea);
    }

    //todo: input hidden for postcode etc. so don't keep getting
    //todo: test postcode error handling
    //todo: no need for the remaining 2 params
    private async Task<IActionResult> HandlePost(string postcode, string? adminArea)
    {
        dynamic routeValues;

        if (adminArea == null)
        {
            var (postcodeError, postcodeInfo) = await _postcodeLookup.Get(postcode);
            if (postcodeError != PostcodeError.None)
            {
                return RedirectToPage("/PostcodeSearch/Index", new { postcodeError });
            }

            routeValues = new
            {
                postcode = postcodeInfo!.Postcode,
                adminArea = postcodeInfo.AdminArea,
                latitude = postcodeInfo.Latitude,
                longitude = postcodeInfo.Longitude,
                fromPostcodeSearch = true
            };
        }
        else
        {
            //todo: move into method
            //todo: remove all
            //todo: remove all filters of type when multiple
            //todo: remove all went back to postcode search (fromPostcodeSearch?)

            //todo: method to get key and value
            string? remove = Request.Form[IFilter.RemoveKey];
            string? removeKey = null, removeValue = null;
            if (remove != null)
            {
                if (remove == IFilter.RemoveAllValue)
                {
                    removeKey = IFilter.RemoveAllValue;
                }
                else
                {
                    int filterNameEndPos = remove.IndexOf("--", StringComparison.Ordinal);
                    //todo: think through if this is the right way to handle -1
                    if (filterNameEndPos != -1)
                    {
                        removeKey = remove[..filterNameEndPos];
                        removeValue = remove[(filterNameEndPos + 2)..];
                    }
                }
            }

            //todo: remove pageNum when remove != null, to go back to page 1 when removing a/all filter

            //todo: test removing -option-selected - works, but old selected value still in url
            var filteredForm = Request.Form
                .Where(kvp => KeepParam(kvp.Key, removeKey));

            //todo: if option value doesn't also have the option-selected, remove the optional value. except if we do that, we couldn't implement 'show original selection when option is reselected'

            //todo: -option-selected handling
            //todo: children=all works, run through to check
            //todo: empty values are getting cleaned up, so no e.g. activities= . run through to check

            if (removeValue != null)
            {
                filteredForm = filteredForm.Select(kvp => RemoveFilterValue(kvp, removeKey!, removeValue));
            }

            routeValues = new ExpandoObject();
            var routeValuesDictionary = (IDictionary<string, object>)routeValues;

            foreach (var keyValuePair in filteredForm)
            {
                // ToString() stops RedirectToPage() using key=foo&key=bar, and instead we get key=foo,bar which we unpick on the GET
                routeValuesDictionary[keyValuePair.Key] = keyValuePair.Value.ToString();
            }
        }

        return RedirectToPage("/ServiceFilter/Index", routeValues);
    }

    private static KeyValuePair<string, StringValues> RemoveFilterValue(
        KeyValuePair<string, StringValues> kvp, string removeKey, string removeValue)
    {
        if (kvp.Key != removeKey)
            return kvp;

        var values = kvp.Value.ToList();
        values.Remove(removeValue);
        return new KeyValuePair<string, StringValues>(kvp.Key, new StringValues(values.ToArray()));
    }

    // simpler than asking all the filters to remove themselves
    private static HashSet<string> _parametersWhitelist = new()
    {
        "postcode",
        "adminarea",
        "latitude",
        "longitude",
    };

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
            //todo: check
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

        // if we've just come from the postcode search, go with the configured default filter options
        // otherwise, apply the filters from the query parameters
        if (!FromPostcodeSearch)
        {
            Filters = DefaultFilters.Select(fd => fd.ToPostFilter(Request.Query));
            CategoryFilter = DefaultCategoryFilter.ToPostFilter(Request.Query);
        }

        (Services, Pagination) = await GetServicesAndPagination(adminArea, latitude, longitude);

        return Page();
    }

    private static void CheckParameters([NotNull] string? postcode)
    {
        ArgumentException.ThrowIfNullOrEmpty(postcode);
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
        CategoryFilter.AddFilterCriteria(serviceParams);

        OnlyShowOneFamilyHubAndHighlightIt = serviceParams.MaxFamilyHubs is 1;

        var services = await _serviceDirectoryClient.GetServicesWithOrganisation(serviceParams);

        var pagination = new LargeSetPagination(services.TotalPages, CurrentPage);

        return (ServiceMapper.ToViewModel(services.Items), pagination);
    }
}
