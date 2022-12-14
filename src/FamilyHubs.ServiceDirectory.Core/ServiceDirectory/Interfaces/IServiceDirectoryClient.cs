using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralOrganisations;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.SharedKernel;
    
namespace FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;

public interface IServiceDirectoryClient
{
    // leaky, not clean, but this is our service, as opposed to a generic service that we might want to swap
    Task<PaginatedList<OpenReferralServiceDto>> GetServices(
        string districtCode,
        float latitude,
        float longitude,
        int? maximumProximityMeters = null,
        int? givenAge = null,
        bool? isPaidFor = null,
        int? maxFamilyHubs = null,
        bool? familyHub = null,
        IEnumerable<string>? taxonomyIds = null,
        int? pageNumber = null,
        int? pageSize = null,
        CancellationToken cancellationToken = default);

    // caches organisations for 1 hour
    Task<OpenReferralOrganisationDto> GetOrganisation(string id, CancellationToken cancellationToken = default);

    Task<PaginatedList<ServiceWithOrganisation>> GetServicesWithOrganisation(
        string districtCode,
        float latitude,
        float longitude,
        int? maximumProximityMeters = null,
        int? givenAge = null,
        bool? isPaidFor = null,
        int? maxFamilyHubs = null,
        bool? familyHub = null,
        IEnumerable<string>? taxonomyIds = null,
        int? pageNumber = null,
        int? pageSize = null,
        CancellationToken cancellationToken = default);
}
