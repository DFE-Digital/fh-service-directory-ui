using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using FamilyHubs.ServiceDirectory.Web.Mappers;

namespace FamilyHubs.ServiceDirectory.Web.Pages;

public partial class ServiceFilterModel : PageModel
{
    private readonly IServiceDirectoryClient _serviceDirectoryClient;

    public string? Postcode { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }

    public ServiceFilterModel(IServiceDirectoryClient serviceDirectoryClient)
    {
        _serviceDirectoryClient = serviceDirectoryClient;
        Services = Enumerable.Empty<Service>();
        // we set this to true when neither show filter is selected
        OnlyShowOneFamilyHubAndHighlightIt = true;
    }

    public async Task OnGet(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        // we degrade gracefully if postcode or lat/long is missing, as we can handle that
        Postcode = postcode;

        ArgumentException.ThrowIfNullOrEmpty(adminDistrict);

        var services = await _serviceDirectoryClient.GetServices(
            adminDistrict,
            latitude,
            longitude);
        Services = ServiceMapper.ToViewModel(services.Items);
    }
}
//todo: website url
//todo: long distances