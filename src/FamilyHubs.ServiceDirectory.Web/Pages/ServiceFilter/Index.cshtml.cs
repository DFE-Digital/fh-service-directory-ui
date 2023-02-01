using System.Diagnostics.CodeAnalysis;
using System.Dynamic;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.Pagination;
using FamilyHubs.ServiceDirectory.Core.Pagination.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Content;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public class ServiceFilterModel : PageModel
{
    public IEnumerable<IFilter> Filters { get; set; }
    //todo: into Filters (above)
    public IFilterSubGroups TypeOfSupportFilter { get; set; }
    public string? Postcode { get; set; }
    public string? AdminDistrict { get; set; }
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
        Filters = FilterDefinitions.Filters;
        TypeOfSupportFilter = FilterDefinitions.CategoryFilter;
        Services = Enumerable.Empty<Service>();
        OnlyShowOneFamilyHubAndHighlightIt = false;
        CurrentPage = 1;
        Pagination = new DontShowPagination();
    }

    public Task<IActionResult> OnPost(string? postcode, string? adminDistrict, float? latitude, float? longitude, string? remove, string? pageNum)
    {
        CheckParameters(postcode);

        return HandlePost(postcode, adminDistrict, latitude, longitude, remove, pageNum);
    }

    //todo: if get them generically from the form, remove lat, long etc
#pragma warning disable S1172
    //todo: input hidden for postcode etc. so don't keep getting
    //todo: isget -> show no results when admindistrict is null?
    //todo: test postcode error handling
    //todo: 2 sep postcodes?
    private async Task<IActionResult> HandlePost(string postcode, string? adminDistrict, float? latitude, float? longitude, string? remove, string? pageNum)
    {
        dynamic routeValues;

        if (adminDistrict == null)
        {
            var (postcodeError, postcodeInfo) = await _postcodeLookup.Get(postcode);
            if (postcodeError != PostcodeError.None)
            {
                return RedirectToPage("/PostcodeSearch/Index", new { postcodeError });
            }

            routeValues = new
            {
                postcode = postcodeInfo!.Postcode,
                // todo: rename AdminDistrict
                adminDistrict = postcodeInfo.AdminArea,
                latitude = postcodeInfo.Latitude,
                longitude = postcodeInfo.Longitude,
                fromPostcodeSearch = true
            };
        }
        else
        {
            routeValues = new ExpandoObject();

            var routeValuesDictionary = (IDictionary<string, object>)routeValues;
            foreach (var keyValuePair in Request.Form.Where(kvp => kvp.Key != "__RequestVerificationToken"))
            {
                routeValuesDictionary[keyValuePair.Key] = keyValuePair.Value;
            }
        }

        return RedirectToPage("/ServiceFilter/Index", routeValues);
    }

    public Task<IActionResult> OnGet(string? postcode, string? adminDistrict, float? latitude, float? longitude, string? remove, string? pageNum, bool? fromPostcodeSearch)
    {
        if (AnyParametersMissing(postcode, adminDistrict, latitude, longitude))
        {
            // handle cases:
            //todo: check
            // * when user goes filter page => cookie page => back link from success banner
            // * user manually removes query parameters from url
            // * user goes directly to page by typing it into the address bar
            return Task.FromResult<IActionResult>(RedirectToPage("/PostcodeSearch/Index"));
        }

        return HandleGet(postcode!, adminDistrict!, latitude!.Value, longitude!.Value, fromPostcodeSearch);
    }

    private static bool AnyParametersMissing(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        return string.IsNullOrEmpty(postcode)
               || string.IsNullOrEmpty(adminDistrict)
               || latitude == null
               || longitude == null;
    }

    private async Task<IActionResult> HandleGet(string postcode, string adminDistrict, float latitude, float longitude, bool? fromPostcodeSearch)
    {
        FromPostcodeSearch = fromPostcodeSearch == true;
        Postcode = postcode;
        AdminDistrict = adminDistrict;
        Latitude = latitude;
        Longitude = longitude;

        //todo: display friendly ids in url?

        //todo: remove should be in request.query, so should be able to remove

        // if we've just come from the postcode search, go with the configured default filter options
        // otherwise, apply the filters from the query parameters
        if (!FromPostcodeSearch)
        {
            Filters = FilterDefinitions.Filters.Select(fd => fd.ToPostFilter(Request.Query, Request.Query["remove"]));
            TypeOfSupportFilter = FilterDefinitions.CategoryFilter.ToPostFilter(Request.Query, Request.Query["remove"]);
        }

        string pageNum = Request.Query["pageNum"].ToString();
        if (!string.IsNullOrWhiteSpace(pageNum))
            CurrentPage = int.Parse(pageNum);

        (Services, Pagination) = await GetServicesAndPagination(adminDistrict, latitude, longitude);

        return Page();
    }

    private static void CheckParameters([NotNull] string? postcode)
    {
        ArgumentException.ThrowIfNullOrEmpty(postcode);
    }

    private async Task<(IEnumerable<Service>, IPagination)> GetServicesAndPagination(string adminDistrict, float latitude, float longitude)
    {
        //todo: add method to filter to add its filter criteria to a request object sent to getservices.., then call in a foreach loop
        int? searchWithinMeters = null;
        var searchWithinFilter = Filters.First(f => f.Name == FilterDefinitions.SearchWithinFilterName);
        var searchWithFilterValue = searchWithinFilter.Values.FirstOrDefault();
        if (searchWithFilterValue != null)
        {
            searchWithinMeters = DistanceConverter.MilesToMeters(int.Parse(searchWithFilterValue));
        }

        bool? isPaidFor = null;
        var costFilter = Filters.First(f => f.Name == FilterDefinitions.CostFilterName);
        if (costFilter.Values.Count() == 1)
        {
            isPaidFor = costFilter.Values.First() == "pay-to-use";
        }

        bool? familyHubFilter = null;
        var showFilter = Filters.First(f => f.Name == FilterDefinitions.ShowFilterName);
        switch (showFilter.Values.Count())
        {
            case 0:
                OnlyShowOneFamilyHubAndHighlightIt = true;
                break;
            case 1:
                familyHubFilter = bool.Parse(showFilter.Values.First());
                break;
            //case 2: there are only 2 options, so if both are selected, there's no need to filter
        }

        int? givenAge = null;
        var childrenFilter = Filters.First(f => f.Name == FilterDefinitions.ChildrenAndYoungPeopleFilterName);
        var childFilterValue = childrenFilter.Values.FirstOrDefault();
        if (childFilterValue != null && childFilterValue != FilterDefinitions.ChildrenAndYoungPeopleAllId)
        {
            givenAge = int.Parse(childFilterValue);
        }

        var services = await _serviceDirectoryClient.GetServicesWithOrganisation(
            adminDistrict,
            latitude,
            longitude,
            searchWithinMeters,
            givenAge,
            isPaidFor,
            OnlyShowOneFamilyHubAndHighlightIt ? 1 : null,
            familyHubFilter,
            TypeOfSupportFilter.Values,
            CurrentPage,
            PageSize);

        var pagination = new LargeSetPagination(services.TotalPages, CurrentPage);

        return (ServiceMapper.ToViewModel(services.Items), pagination);
    }
}
