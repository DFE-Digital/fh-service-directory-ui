using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Content;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
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

#pragma warning disable
    //[BindProperty]
    //public string? search_within { get; set; }

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

        var services = await _serviceDirectoryClient.GetServices(
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

    //todo: bind, or pick out using data filter model??

#pragma warning disable
    private async Task HandlePost(string postcode, string adminDistrict, float latitude, float longitude, string? remove)
    {
        Postcode = postcode;
        //todo: apply initial selected filter to first service get. apply clear filters for initial selected
        //base class for filter with functionality?
        //var filter = Filters.First(f => f.Name == "search_within");

        var postFilters = FilterDefinitions.Filters.Select(fd => fd.ToPostFilter(Request.Form, remove));

        //todo: null
        Filters = postFilters;

        var filter = postFilters.First(f => f.Name == "search_within");

        //todo: work off form and pass back value to set in model, or work with model directly using lambdas/reflection?
        //filter.ProcessModel(Request.Form, remove);
        //var (fullValue, value) = ProcessModel(filter, Request.Form, remove);

        //const int xx = "search_within--".Length();
        //todo: case?
        if (!int.TryParse(filter.Value, out var searchWithinMiles))
        {
            throw new NotImplementedException();
        }

        var services = await _serviceDirectoryClient.GetServices(
            adminDistrict,
            latitude,
            longitude,
            DistanceConverter.MilesToMeters(searchWithinMiles));
        Services = ServiceMapper.ToViewModel(services.Items);
    }

    //todo: move to filter
    //this is radio
    //private (string?, string?) ProcessModel(Filter filter, IFormCollection form, string? remove)
    //{
    //    string? fullValue = form[filter.Name];
    //    if (fullValue == null)
    //        return (null, null);

    //    //todo: const on filter? 2 is for "--"
    //    string value = fullValue.Substring(filter.Name.Length + 2);

    //    return (fullValue, value);
    //}


    // FilterContent.Select(f.GetPostFilter)

    //public class RadioFilter
    //{
    //    public readonly Filter Filter;

    //    public RadioFilter(Filter filter, IFormCollection form, string? remove)
    //    {
    //        Filter = filter;
    //    }

    //    public bool IsSelected(IFilterAspect aspect)
    //    {

    //    }
    //}
}
//todo: long distances