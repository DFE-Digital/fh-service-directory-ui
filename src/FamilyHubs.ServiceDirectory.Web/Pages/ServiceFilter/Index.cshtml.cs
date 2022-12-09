using System.Diagnostics.CodeAnalysis;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Content;
using FamilyHubs.ServiceDirectory.Web.Filtering;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public class ServiceFilterModel : PageModel
{
    private readonly IServiceDirectoryClient _serviceDirectoryClient;

    public IEnumerable<IFilter> Filters { get; set; }
    //todo: into Filters (above)
    public IFilterSubGroups CategoryFilter { get; set; }
    public string? Postcode { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }
    public bool IsGet { get; set; }

    public ServiceFilterModel(IServiceDirectoryClient serviceDirectoryClient)
    {
        _serviceDirectoryClient = serviceDirectoryClient;
        Filters = FilterDefinitions.Filters;
        CategoryFilter = FilterDefinitions.CategoryFilter;
        Services = Enumerable.Empty<Service>();
        OnlyShowOneFamilyHubAndHighlightIt = false;
    }

    public Task OnGet(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        CheckParameters(postcode, adminDistrict, latitude, longitude);

        return HandleGet(postcode, adminDistrict, latitude.Value, longitude.Value);
    }

    private static void CheckParameters([NotNull] string? postcode, [NotNull] string? adminDistrict, [NotNull] float? latitude, [NotNull] float? longitude)
    {
        // we _could_ degrade gracefully if postcode or lat/long is missing,
        // as we can handle that by not showing the postcode or distances
        // but instead let's fail fast if someone is monkeying with the url (or there's a bug)
        ArgumentException.ThrowIfNullOrEmpty(postcode);
        ArgumentException.ThrowIfNullOrEmpty(adminDistrict);
        ArgumentNullException.ThrowIfNull(latitude);
        ArgumentNullException.ThrowIfNull(longitude);
    }

    private async Task HandleGet(string postcode, string adminDistrict, float latitude, float longitude)
    {
        IsGet = true;
        Postcode = postcode;

        Services = await GetServices(adminDistrict, latitude, longitude);
    }

    public Task OnPost(string? postcode, string? adminDistrict, float? latitude, float? longitude, string? remove)
    {
        CheckParameters(postcode, adminDistrict, latitude, longitude);

        return HandlePost(postcode!, adminDistrict!, latitude!.Value, longitude!.Value, remove);
    }

    private async Task HandlePost(string postcode, string adminDistrict, float latitude, float longitude, string? remove)
    {
        IsGet = false;

        Postcode = postcode;

        Filters = FilterDefinitions.Filters.Select(fd => fd.ToPostFilter(Request.Form, remove));
        //todo: change FilterSubGroup to class and add ToPost...?
        CategoryFilter = new PostFilterSubGroups(FilterDefinitions.CategoryFilter, Request.Form, remove);

        Services = await GetServices(adminDistrict, latitude, longitude);
    }

    private async Task<IEnumerable<Service>> GetServices(string adminDistrict, float latitude, float longitude)
    {
        //todo: add method to filter to add its filter criteria to a request object sent to getservices.., then call in a foreach loop
        int? searchWithinMeters = null;
        var searchWithinFilter = Filters.First(f => f.Name == FilterDefinitions.SearchWithinFilterName);
        var searchWithFilterValue = searchWithinFilter.Values.FirstOrDefault();
        if (searchWithFilterValue != null)
        {
            //todo: cut out name here, rather than for all
            searchWithinMeters = DistanceConverter.MilesToMeters(int.Parse(searchWithFilterValue));
        }

        bool? isPaidFor = null;
        var costFilter = Filters.First(f => f.Name == FilterDefinitions.CostFilterName);
        if (costFilter.Values.Count() == 1)
        {
            isPaidFor = costFilter.Values.First() == "pay-to-use";
        }

        string? showOrganisationType = null;
        var showFilter = Filters.First(f => f.Name == FilterDefinitions.ShowFilterName);
        switch (showFilter.Values.Count())
        {
            case 0:
                OnlyShowOneFamilyHubAndHighlightIt = true;
                break;
            case 1:
                showOrganisationType = showFilter.Values.First();
                break;
        }

        // whilst we limit results to a single local authority, we don't actually need to get the organisation for each service
        // we could assume that they all share the same organisation
        // leave it as-is for now though (as we handle the more generic case)

        var services = await _serviceDirectoryClient.GetServicesWithOrganisation(
            adminDistrict,
            latitude,
            longitude,
            searchWithinMeters,
            null,
            null,
            isPaidFor,
            showOrganisationType,
            CategoryFilter.Values);
        return ServiceMapper.ToViewModel(services.Items);
    }
}
