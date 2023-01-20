using System.Diagnostics.CodeAnalysis;
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
#pragma warning disable

public class ServiceFilterModel : PageModel
{
    public IEnumerable<IFilter> Filters { get; set; }
    //todo: into Filters (above)
    public IFilterSubGroups TypeOfSupportFilter { get; set; }
    public string? Postcode { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }
    public bool IsGet { get; set; }
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

    public Task<IActionResult> OnGet(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        if (AnyParametersMissing(postcode, adminDistrict, latitude, longitude))
        {
            // handle cases:
            // * when user goes filter page => cookie page => back link from success banner
            // * user manually removes query parameters from url
            return Task.FromResult<IActionResult>(RedirectToPage("/PostcodeSearch/Index"));
        }

        return HandleGet(postcode!, adminDistrict!, latitude!.Value, longitude!.Value);
    }

    private static bool AnyParametersMissing(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        return string.IsNullOrEmpty(postcode)
                || string.IsNullOrEmpty(adminDistrict)
                || latitude == null
                || longitude == null;
    }

    //    private static void CheckParameters([NotNull] string? postcode, [NotNull] string? adminDistrict, [NotNull] float? latitude, [NotNull] float? longitude)
    private static void CheckParameters([NotNull] string? postcode)
    {
        ArgumentException.ThrowIfNullOrEmpty(postcode);
        //ArgumentException.ThrowIfNullOrEmpty(adminDistrict);
        //ArgumentNullException.ThrowIfNull(latitude);
        //ArgumentNullException.ThrowIfNull(longitude);
    }

    private async Task<IActionResult> HandleGet(string postcode, string adminDistrict, float latitude, float longitude)
    {
        IsGet = true;
        Postcode = postcode;

        (Services, Pagination) = await GetServicesAndPagination(adminDistrict, latitude, longitude);

        return Page();
    }

    public Task<IActionResult> OnPost(string? postcode, string? adminDistrict, float? latitude, float? longitude, string? remove, string? pageNum)
    {
        CheckParameters(postcode); //, adminDistrict, latitude, longitude);

        return HandlePost(postcode, adminDistrict, latitude, longitude, remove, pageNum);
    }

    private async Task<IActionResult> HandlePost(string postcode, string? adminDistrict, float? latitude, float? longitude, string? remove, string? pageNum)
    {
        IsGet = false;

        if (adminDistrict == null)
        {
            var (postcodeError, postcodeInfo) = await _postcodeLookup.Get(postcode);
            if (postcodeError != PostcodeError.None)
            {
                return RedirectToPage("/PostcodeSearch/Index", new { postcodeError });
            }

            Postcode = postcodeInfo!.Postcode;
            adminDistrict = postcodeInfo.Codes.AdminDistrict;
            latitude = postcodeInfo.Latitude;
            longitude = postcodeInfo.Longitude;
        }

        Filters = FilterDefinitions.Filters.Select(fd => fd.ToPostFilter(Request.Form, remove));
        TypeOfSupportFilter = FilterDefinitions.CategoryFilter.ToPostFilter(Request.Form, remove);

        //todo: have page in querystring for bookmarking?
        if (!string.IsNullOrWhiteSpace(pageNum))
            CurrentPage = int.Parse(pageNum);

        //todo: proper checks
        (Services, Pagination) = await GetServicesAndPagination(adminDistrict, latitude.Value, longitude.Value);

        return Page();
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

        // whilst we limit results to a single local authority, we don't actually need to get the organisation for each service
        // we could assume that they all share the same organisation
        // leave it as-is for now though (as we handle the more generic case)

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
