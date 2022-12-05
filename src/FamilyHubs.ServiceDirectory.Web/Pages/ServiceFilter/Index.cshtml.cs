using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;
public partial class ServiceFilterModel : PageModel
{
    private readonly IServiceDirectoryClient _serviceDirectoryClient;

    public string? Postcode { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }

    [BindProperty]
    public string? search_within { get; set; }

    public ServiceFilterModel(IServiceDirectoryClient serviceDirectoryClient)
    {
        _serviceDirectoryClient = serviceDirectoryClient;
        Services = Enumerable.Empty<Service>();
        // we set this to true when neither show filter is selected
        OnlyShowOneFamilyHubAndHighlightIt = true;
    }

    public Task OnGet(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        // we _could_ degrade gracefully if postcode or lat/long is missing,
        // as we can handle that by not showing the postcode or distances
        // but instead let's fail fast if someone is monkeying with the url (or there's a bug)
        ArgumentException.ThrowIfNullOrEmpty(postcode);
        ArgumentException.ThrowIfNullOrEmpty(adminDistrict);
        ArgumentNullException.ThrowIfNull(latitude);
        ArgumentNullException.ThrowIfNull(longitude);

        return HandleGet(postcode, adminDistrict, latitude.Value, longitude.Value);
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

    public Task OnPost(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        //todo: checks
        return HandlePost(postcode!, adminDistrict!, latitude!.Value, longitude!.Value);
    }

    //todo: bind, or pick out using data filter model??

#pragma warning disable
    private async Task HandlePost(string postcode, string adminDistrict, float latitude, float longitude)
    {
        Postcode = postcode;

        //const int xx = "search_within--".Length();
        //todo: case?
        if (!int.TryParse(search_within.Substring(15), out var searchWithinMiles))
        {
            throw new NotImplementedException();
        }

        var services = await _serviceDirectoryClient.GetServices(
            adminDistrict,
            latitude,
            longitude,
            //todo: helper. combine with other way round
            (int)(searchWithinMiles * 1609.34));
        Services = ServiceMapper.ToViewModel(services.Items);
    }
}
//todo: long distances