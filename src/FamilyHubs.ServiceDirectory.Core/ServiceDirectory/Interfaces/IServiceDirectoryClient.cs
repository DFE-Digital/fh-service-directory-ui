using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralOrganisations;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.SharedKernel;
    
namespace FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;

public class ServicesWithOrganisationParams
{
    public ServicesWithOrganisationParams(string adminArea, float latitude, float longitude)
    {
        AdminArea = adminArea;
        Latitude = latitude;
        Longitude = longitude;
    }

    public string AdminArea { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public int? MaximumProximityMeters { get; set; }
    public int? GivenAge { get; set; }
    public bool? IsPaidFor { get; set; }
    public int? MaxFamilyHubs { get; set; }
    public bool? FamilyHub { get; set; }
    public IEnumerable<string>? TaxonomyIds { get; set; }
    public int? PageNumber { get; set; }
    public int? PageSize { get; set; }
}

public interface IServiceDirectoryClient
{
    // leaky, not clean, but this is our service, as opposed to a generic service that we might want to swap
    Task<PaginatedList<OpenReferralServiceDto>> GetServices(
        ServicesWithOrganisationParams servicesWithOrganisationParams,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Fetches an organisation from the service directory
    /// </summary>
    /// <param name="id">The ID of the organisation to fetch.</param>
    /// <param name="cancellationToken"></param>
    /// <returns>The organisation</returns>
    /// <remarks>
    /// Organisations are cached for 1 hour.
    /// </remarks>
    Task<OpenReferralOrganisationDto> GetOrganisation(string id, CancellationToken cancellationToken = default);

    Task<PaginatedList<ServiceWithOrganisation>> GetServicesWithOrganisation(
        ServicesWithOrganisationParams servicesWithOrganisationParams,
        CancellationToken cancellationToken = default);
}
