using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Content;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public class ServiceFilterModel : PageModel
{
    private readonly IServiceDirectoryClient _serviceDirectoryClient;

    public IEnumerable<IFilter> Filters { get; set; }
    //todo: into Filters (above)
    public FilterSubGroups CategoryFilter { get; set; }
    public string? Postcode { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }

    public ServiceFilterModel(IServiceDirectoryClient serviceDirectoryClient)
    {
        _serviceDirectoryClient = serviceDirectoryClient;
        Filters = FilterDefinitions.Filters;
        CategoryFilter = FilterDefinitions.CategoryFilter;
        Services = Enumerable.Empty<Service>();
        // we set this to true when neither show filter is selected
        OnlyShowOneFamilyHubAndHighlightIt = true;
    }

    public Task OnGet(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        CheckParameters(postcode, adminDistrict, latitude, longitude);

        return HandleGet(postcode!, adminDistrict!, latitude!.Value, longitude!.Value);
    }

    //todo: attribute to say null safe?
    private static void CheckParameters(string? postcode, string? adminDistrict, float? latitude, float? longitude)
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
        Postcode = postcode;

        // whilst we limit results to a single local authority, we don't actually need to get the organisation for each service
        // we could assume that they all share the same organisation
        // leave it as-is for now though (as we handle the more generic case)
        var services = await _serviceDirectoryClient.GetServicesWithOrganisation(
            adminDistrict,
            latitude,
            longitude);
        Services = ServiceMapper.ToViewModel(services.Items);
    }

    public Task OnPost(string? postcode, string? adminDistrict, float? latitude, float? longitude, string? remove)
    {
        CheckParameters(postcode, adminDistrict, latitude, longitude);

        return HandlePost(postcode!, adminDistrict!, latitude!.Value, longitude!.Value, remove);
    }

    private async Task HandlePost(string postcode, string adminDistrict, float latitude, float longitude, string? remove)
    {
        Postcode = postcode;

        Filters = FilterDefinitions.Filters.Select(fd => fd.ToPostFilter(Request.Form, remove));

        var filter = (IPostFilter)Filters.First(f => f.Name == FilterDefinitions.SearchWithinFilterName);

        int? searchWithinMeters = null;
        if (filter.Value != null)
        {
            searchWithinMeters = DistanceConverter.MilesToMeters(int.Parse(filter.Value));
        }

        var services = await _serviceDirectoryClient.GetServicesWithOrganisation(
            adminDistrict,
            latitude,
            longitude,
            searchWithinMeters);
        Services = ServiceMapper.ToViewModel(services.Items);
    }
}
//todo: long distances